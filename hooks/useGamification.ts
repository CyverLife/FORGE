import { getProgressToNextLevel } from '@/lib/gamification';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export interface GamificationState {
    level: number;
    xp: number;
    antiGravityScore: number;
    progress: number;
}

export function useGamification() {
    const { session } = useAuth();
    const [stats, setStats] = useState<GamificationState>({
        level: 1,
        xp: 0,
        antiGravityScore: 0,
        progress: 0,
    });

    useEffect(() => {
        if (!session?.user) return;

        const CACHE_KEY = `gamification_cache_${session.user.id}`;

        // Load from cache first for instant UI
        const loadCache = async () => {
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            if (cached) {
                setStats(JSON.parse(cached));
            }
        };

        // Fetch initial stats from Supabase
        const fetchStats = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('level, xp, anti_gravity_score')
                .eq('id', session.user.id)
                .single();

            if (data) {
                const newState = {
                    level: data.level || 1,
                    xp: data.xp || 0,
                    antiGravityScore: data.anti_gravity_score || 0,
                    progress: getProgressToNextLevel(data.xp || 0),
                };
                setStats(newState);
                await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(newState));
            }
        };

        loadCache();
        fetchStats();

        // Subscribe to realtime updates
        const channel = supabase
            .channel('gamification')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${session.user.id}`,
                },
                (payload) => {
                    const newData = payload.new;
                    const newState = {
                        level: newData.level,
                        xp: newData.xp,
                        antiGravityScore: newData.anti_gravity_score,
                        progress: getProgressToNextLevel(newData.xp),
                    };
                    setStats(newState);
                    AsyncStorage.setItem(CACHE_KEY, JSON.stringify(newState));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [session]);

    return stats;
}
