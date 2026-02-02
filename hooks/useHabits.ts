import { supabase } from '@/lib/supabase';
import { Habit } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';

export function useHabits() {
    const { session } = useAuth();
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
                // Sort logs by date desc
                const sortedLogs = (habit.logs || []).sort((a: any, b: any) =>
                    new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
                );

                // 1. Calculate Streak
                let streak = 0;
                const today = new Date().setHours(0, 0, 0, 0);
                let currentCheckDate = new Date(); // Start checking from today
                currentCheckDate.setHours(0, 0, 0, 0);

                // Check if completed today to start streak count, otherwise start checking from yesterday
                const completedToday = sortedLogs.some((l: any) => {
                    const d = new Date(l.completed_at);
                    d.setHours(0, 0, 0, 0);
                    return d.getTime() === today && l.status === 'completed';
                });

                // If not completed today, we start looking for a streak from yesterday.
                // If completed today, the loop will catch it or we can just start loop from today.
                // Simpler logic: Iterate days backwards.

                let dayIterator = new Date();
                dayIterator.setHours(0, 0, 0, 0);

                // If not completed today, maybe the streak is still alive from yesterday?
                // "Streak" usually implies consecutive days up to now. 
                // If I missed today, streak might be 0 or saved if I have time left. 
                // Let's assume standard logic: streak breaks if missed yesterday AND today.
                // But for calculation, let's just count consecutive filled days backwards.

                for (let i = 0; i < 365; i++) { // Check last year max
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
                            // If today is missed, it doesn't break streak YET (unless it's tomorrow). 
                            // But usually streak is "days in a row ending today or yesterday".
                            // Let's check yesterday.
                            continue;
                        }
                        // Break on first missing day (after today check)
                        if (i > 0) break;
                    }

                    // Go to previous day
                    dayIterator.setDate(dayIterator.getDate() - 1);
                }

                // 2. Calculate Consistency (Logic: Completed / Total Days since Creation)
                // Or last 30 days consistency. Let's do last 30 days for "Game".
                const last30Days = 30;
                let completedLast30 = 0;
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                const recentLogs = sortedLogs.filter((l: any) => new Date(l.completed_at) > thirtyDaysAgo);
                completedLast30 = recentLogs.filter((l: any) => l.status === 'completed').length;

                const consistency = Math.min(100, Math.round((completedLast30 / last30Days) * 100));

                return {
                    ...habit,
                    completed_today: completedToday,
                    streak,
                    consistency,
                    // Remove raw logs from object to match type (stats consumed)
                };
            });

            setHabits(habitsWithStats);
            const CACHE_KEY = `habits_cache_${session.user.id}`;
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(habitsWithStats));
        }
        setLoading(false);
    }, [session]);

    useEffect(() => {
        if (!session?.user) return;

        const CACHE_KEY = `habits_cache_${session.user.id}`;
        const loadCache = async () => {
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            if (cached) setHabits(JSON.parse(cached));
        };

        loadCache();
        fetchHabits();
    }, [session, fetchHabits]);

    const addHabit = async (habit: Omit<Habit, 'id'>) => {
        if (!session?.user) return;

        try {
            // Sanitize: Remove frontend-only properties that don't exist in DB
            const { completed_today, streak, consistency, points, xp_reward, ...habitData } = habit;

            const { data, error } = await supabase
                .from('habits')
                .insert([{ ...habitData, user_id: session.user.id }])
                .select()
                .single();

            if (error) {
                // PGRST116: JSON object requested, multiple (or no) results returned
                // 204: No Content (successful insert but no return)
                if (error.code === 'PGRST116' || error.code === '204') {
                    // If we can't get the single row back, let's just refetch the whole list
                    // This is a safe fallback
                    await fetchHabits();
                    return;
                }
                throw error;
            }

            if (data) {
                // Manual State Update (Faster than re-fetching)
                setHabits(current => {
                    const newHabit = {
                        ...data,
                        completed_today: false,
                        streak: 0,
                        consistency: 0,
                        logs: []
                    };
                    return [newHabit, ...current];
                });
                return data;
            }
        } catch (e) {
            console.error('Error adding habit:', e);
            throw e;
        }
    };

    const logHabit = async (habitId: string, status: 'completed' | 'failed' | 'skipped') => {
        if (!session?.user) return;

        // Optimistic Update
        const previousHabits = [...habits];
        setHabits(current => current.map(h => {
            if (h.id === habitId) {
                const isCompleted = status === 'completed';
                return {
                    ...h,
                    completed_today: isCompleted,
                    streak: isCompleted ? h.streak + 1 : h.streak, // Simplified increment for immediate feedback
                    // Consistency would require complex recalculation, skipping for optimistic update
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

            // Background refresh to ensure consistency with server logic
            // fetchHabits(); // Optional: uncomment if we want to sync perfectly after
        } catch (error) {
            console.error('Error logging habit:', error);
            // Rollback
            setHabits(previousHabits);
            Alert.alert('Error', 'Failed to save progress. Changes reverted.');
        }
    };

    const deleteHabit = async (habitId: string) => {
        if (!session?.user) return;

        // Optimistic Update
        const previousHabits = [...habits];
        setHabits(current => current.filter(h => h.id !== habitId));

        try {
            const { error } = await supabase
                .from('habits')
                .delete()
                .eq('id', habitId)
                .eq('user_id', session.user.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting habit:', error);
            // Rollback
            setHabits(previousHabits);
            Alert.alert('Error', 'Failed to delete protocol. Changes reverted.');
        }
    };

    return { habits, loading, addHabit, logHabit, deleteHabit };
}
