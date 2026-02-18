import { useAuth } from '@/hooks/useAuth';
import { awardVariableXP, VariableReward } from '@/lib/rewards';
import { supabase } from '@/lib/supabase';
import { Habit } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useGlobalAlert } from './GlobalAlertContext';

import { useSquadsContext } from './SquadsContext';

interface HabitsContextType {
    habits: Habit[];
    loading: boolean;
    addHabit: (habit: Omit<Habit, 'id'>) => Promise<Habit | undefined>;
    updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
    deleteHabit: (id: string) => Promise<void>;
    logHabit: (habitId: string, status: 'completed' | 'failed' | 'skipped') => Promise<VariableReward | undefined>;
    fetchHabits: () => Promise<void>;
    lastReward: VariableReward | null;
};

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export function HabitsProvider({ children }: { children: React.ReactNode }) {
    const { session } = useAuth();
    const { showAlert } = useGlobalAlert();
    const { activeSquad, updateSquadHP } = useSquadsContext();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastReward, setLastReward] = useState<VariableReward | null>(null);

    const fetchHabits = useCallback(async () => {
        if (!session?.user) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('habits')
            .select('*, logs(status, completed_at)')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[HABITS_CONTEXT] Fetch Error:', error);
        }

        if (!error && data) {
            console.log(`[HABITS_CONTEXT] Fetched ${data.length} raw habits for user ${session.user.id}`);
            const habitsWithStats: Habit[] = data.map((habit: any) => {
                const sortedLogs = (habit.logs || []).sort((a: any, b: any) =>
                    new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
                );

                // Check completed today
                const todayStr = new Date().toISOString().split('T')[0];

                const completedToday = sortedLogs.some((l: any) => {
                    if (!l.completed_at || l.status !== 'completed') return false;
                    const logDateStr = new Date(l.completed_at).toISOString().split('T')[0];
                    return logDateStr === todayStr;
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

    const addHabit = async (habit: Omit<Habit, 'id'>): Promise<Habit | undefined> => {
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
                console.log('[HABITS_CONTEXT] Insert Successful. Row ID:', data.id);
                const newHabit: Habit = {
                    ...data,
                    completed_today: false,
                    streak: 0,
                    consistency: 0,
                    logs: [] // Ensure logs is initialized locally
                };
                console.log('[HABITS_CONTEXT] Adding to state:', newHabit.title, 'ID:', newHabit.id);
                setHabits(current => [newHabit, ...current]);
                return newHabit;
            }
        } catch (e: any) {
            console.error('Error adding habit:', e);
            showAlert('Error', e.message || 'Failed to create habit');
            throw e;
        }
    };

    const updateHabit = async (id: string, updates: Partial<Habit>) => {
        if (!session?.user) return;
        try {
            // Remove frontend-only props from updates
            const { completed_today, streak, consistency, points, xp_reward, ...updateData } = updates;

            const { error } = await supabase
                .from('habits')
                .update(updateData)
                .eq('id', id)
                .eq('user_id', session.user.id);

            if (error) throw error;

            setHabits(current => current.map(h => h.id === id ? { ...h, ...updates } : h));
        } catch (e: any) {
            console.error('Error updating habit:', e);
            showAlert('Error', e.message || 'Failed to update habit');
            throw e;
        }
    };

    const logHabit = async (habitId: string, status: 'completed' | 'failed' | 'skipped'): Promise<VariableReward | undefined> => {
        if (!session?.user) return;

        const habit = habits.find(h => h.id === habitId);
        if (!habit) return;

        // ANTI-CHEAT: Prevent double logging if already completed today
        if (habit.completed_today && status === 'completed') {
            console.log('[ANTI-CHEAT] Habit already completed today. Blocking duplicate log.');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            return;
        }

        // Optimistic Update
        const previousHabits = [...habits];

        // Calculate variable XP reward for completed habits
        let reward: VariableReward | undefined;
        if (status === 'completed') {
            // Get current user streak from first habit (they all share same user streak)
            const currentStreak = habits[0]?.streak || 0;
            reward = await awardVariableXP(session.user.id, currentStreak);
            setLastReward(reward);
        }

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

            if (error) {
                // If unique constraint violation (code 23505), just ignore it as "success" 
                // because it means we are already consistent with DB context.
                if (error.code === '23505') {
                    console.warn('[ANTI-CHEAT] Duplicate log prevented by DB constraint.');
                    return reward;
                }
                throw error;
            }

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
            console.error('LOG HABIT ERROR:', JSON.stringify(error, null, 2));
            setHabits(previousHabits);
            // Throw error so UI can handle it (and stop success feedback)
            throw error;
        }
        return reward;
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
            throw error;
        }
    };

    const value = React.useMemo(() => ({
        habits,
        loading,
        addHabit,
        updateHabit,
        deleteHabit,
        logHabit,
        fetchHabits,
        lastReward
    }), [habits, loading, addHabit, updateHabit, deleteHabit, logHabit, fetchHabits, lastReward]);

    return (
        <HabitsContext.Provider value={value}>
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
