import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface Habit {
    id: string;
    title: string;
    attribute: 'IRON' | 'FIRE' | 'STEEL' | 'FOCUS';
    frequency: string[];
    difficulty: number;
}

export function useHabits() {
    const { session } = useAuth();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHabits = async () => {
        if (!session?.user) return;

        setLoading(true);
        const { data, error } = await supabase
            .from('habits')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching habits:', error);
        } else {
            setHabits(data as Habit[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchHabits();
    }, [session]);

    const addHabit = async (habit: Omit<Habit, 'id'>) => {
        if (!session?.user) return;

        const { data, error } = await supabase
            .from('habits')
            .insert([{ ...habit, user_id: session.user.id }])
            .select()
            .single();

        if (error) {
            console.error('Error adding habit:', error);
            throw error;
        }

        setHabits((prev) => [data as Habit, ...prev]);
        return data;
    };

    return { habits, loading, fetchHabits, addHabit };
}
