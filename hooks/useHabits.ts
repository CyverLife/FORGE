import { supabase } from '@/lib/supabase';
import { Habit } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export function useHabits() {
    const { session } = useAuth();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user) return;

        const CACHE_KEY = `habits_cache_${session.user.id}`;

        const loadCache = async () => {
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            if (cached) setHabits(JSON.parse(cached));
        };

        const fetchHabits = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('habits')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setHabits(data as Habit[]);
                await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
            }
            setLoading(false);
        };

        loadCache();
        fetchHabits();
    }, [session]);

    const addHabit = async (habit: Omit<Habit, 'id'>) => {
        if (!session?.user) return;

        const { data, error } = await supabase
            .from('habits')
            .insert([{ ...habit, user_id: session.user.id }])
            .select()
            .single();

        if (error) throw error;

        setHabits((prev) => [data as Habit, ...prev]);
        return data;
    };

    return { habits, loading, addHabit };
}
