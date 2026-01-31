import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { calculateLevel, getProgressToNextLevel } from '@/lib/gamification';

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

        // Fetch initial stats
        const fetchStats = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('level, xp, anti_gravity_score')
                .eq('id', session.user.id)
                .single();

            if (data) {
                setStats({
                    level: data.level || 1,
                    xp: data.xp || 0,
                    antiGravityScore: data.anti_gravity_score || 0,
                    progress: getProgressToNextLevel(data.xp || 0),
                });
            }
        };

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
                    setStats({
                        level: newData.level,
                        xp: newData.xp,
                        antiGravityScore: newData.anti_gravity_score,
                        progress: getProgressToNextLevel(newData.xp),
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [session]);

    return stats;
}
