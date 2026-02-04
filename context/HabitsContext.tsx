import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Habit } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useGlobalAlert } from './GlobalAlertContext';

import { useSquadsContext } from './SquadsContext';

type HabitsContextType = {
    habits: Habit[];
    loading: boolean;
    refreshHabits: () => Promise<void>;
    addHabit: (habit: Omit<Habit, 'id'>) => Promise<any>;
    logHabit: (habitId: string, status: 'completed' | 'failed' | 'skipped') => Promise<void>;
    deleteHabit: (habitId: string) => Promise<void>;
};

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export function HabitsProvider({ children }: { children: React.ReactNode }) {
    const { session } = useAuth();
    const { showAlert } = useGlobalAlert();
    const { activeSquad, updateSquadHP } = useSquadsContext();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHabits = useCallback(async () => {
        if (!session?.user) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('habits')
            .select('*, logs(status, completed_at)')
            .order('created_at', { ascending: false });

        if (!error && data) {
            const habitsWithStats: Habit[] = data.map((habit: any) => {
                const sortedLogs = (habit.logs || []).sort((a: any, b: any) =>
                    new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
                );

                // Check completed today
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const completedToday = sortedLogs.some((l: any) => {
                    const d = new Date(l.completed_at);
                    d.setHours(0, 0, 0, 0);
                    return d.getTime() === today.getTime() && l.status === 'completed';
                });

                // Streak Calculation (Simplified for now)
                let streak = 0;
                let dayIterator = new Date();
                dayIterator.setHours(0, 0, 0, 0);

                for (let i = 0; i < 365; i++) {
                    const targetTime = dayIterator.getTime();
                    const logForDay = sortedLogs.find((l: any) => {
                        const d = new Date(l.completed_at);
                        d.setHours(0, 0, 0, 0);
                        return d.getTime() === targetTime;
                    });

                    if (logForDay && logForDay.status === 'completed') {
                        streak++;
                    } else {
                        if (i === 0 && !completedToday) {
                            // If today missed, check yesterday
                            dayIterator.setDate(dayIterator.getDate() - 1);
                            continue;
                        }
                        if (i > 0) break;
                    }
                    dayIterator.setDate(dayIterator.getDate() - 1);
                }

                return {
                    ...habit,
                    completed_today: completedToday,
                    streak,
                    consistency: 0, // Pending implementation
                };
            });

            setHabits(habitsWithStats);
            const CACHE_KEY = `habits_cache_${session.user.id}`;
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(habitsWithStats));
        }
        setLoading(false);
    }, [session]);

    // Initial Load & Cache
    useEffect(() => {
        if (!session?.user) return;
        const CACHE_KEY = `habits_cache_${session.user.id}`;
        AsyncStorage.getItem(CACHE_KEY).then(cached => {
            if (cached) setHabits(JSON.parse(cached));
        });
        fetchHabits();
    }, [session, fetchHabits]);

    const addHabit = async (habit: Omit<Habit, 'id'>) => {
        if (!session?.user) return;
        try {
            // Remove frontend-only props
            const { completed_today, streak, consistency, points, xp_reward, ...habitData } = habit;

            const { data, error } = await supabase
                .from('habits')
                .insert([{ ...habitData, user_id: session.user.id }])
                .select()
                .single();

            if (error) {
                if (error.code === 'PGRST116' || error.code === '204') {
                    await fetchHabits();
                    return;
                }
                throw error;
            }

            if (data) {
                setHabits(current => [{
                    ...data,
                    completed_today: false,
                    streak: 0,
                    consistency: 0
                }, ...current]);
                return data;
            }
        } catch (e: any) {
            console.error('Error adding habit:', e);
            showAlert('Error', e.message || 'Failed to create habit');
            throw e;
        }
    };

    const logHabit = async (habitId: string, status: 'completed' | 'failed' | 'skipped') => {
        if (!session?.user) return;

        // Optimistic
        const previousHabits = [...habits];
        const habit = habits.find(h => h.id === habitId);

        setHabits(current => current.map(h => {
            if (h.id === habitId) {
                const isCompleted = status === 'completed';

                // Optimistically create the new log object
                const newLog = {
                    habit_id: habitId,
                    user_id: session?.user?.id,
                    status,
                    completed_at: new Date().toISOString()
                };

                return {
                    ...h,
                    completed_today: isCompleted,
                    streak: isCompleted ? h.streak + 1 : h.streak,
                    // Push the new log so lists/charts update instantly
                    logs: h.logs ? [newLog, ...h.logs] : [newLog]
                };
            }
            return h;
        }));

        try {
            const { error } = await supabase
                .from('logs')
                .insert([{
                    habit_id: habitId,
                    user_id: session.user.id,
                    status,
                    completed_at: new Date().toISOString()
                }]);

            if (error) throw error;

            // Squad HP update
            try {
                if (activeSquad) {
                    const hpChange = status === 'completed' ? 2 : status === 'failed' ? -5 : 0;
                    const activityType = status === 'completed' ? 'completed' : status === 'failed' ? 'failed' : 'hp_damage';

                    await updateSquadHP(
                        activeSquad.id,
                        hpChange,
                        activityType,
                        habit?.title
                    );
                }
            } catch (squadError) {
                // Squad update failed, but habit log succeeded
                console.log('Squad HP update skipped:', squadError);
            }

        } catch (error: any) {
            setHabits(previousHabits);
            showAlert('Error', 'Failed to log protocol.');
        }
    };

    const deleteHabit = async (habitId: string) => {
        if (!session?.user) return;

        const previousHabits = [...habits];
        setHabits(current => current.filter(h => h.id !== habitId));

        try {
            const { error } = await supabase
                .from('habits')
                .delete()
                .eq('id', habitId)
                .eq('user_id', session.user.id);

            if (error) throw error;
        } catch (error: any) {
            setHabits(previousHabits);
            showAlert('Error', 'Failed to delete protocol.');
        }
    };

    return (
        <HabitsContext.Provider value={{ habits, loading, refreshHabits: fetchHabits, addHabit, logHabit, deleteHabit }}>
            {children}
        </HabitsContext.Provider>
    );
}

export function useHabitsContext() {
    const context = useContext(HabitsContext);
    if (context === undefined) {
        throw new Error('useHabitsContext must be used within a HabitsProvider');
    }
    return context;
}
