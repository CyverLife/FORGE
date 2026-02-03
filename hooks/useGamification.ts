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
    rank: 'BRONZE' | 'SILVER' | 'GOLD' | 'INFINITE';
    prestige: number;
    consciousnessRank: 'BRONCE' | 'PLATA' | 'ORO' | 'INFINITO';
    consciousnessLevel: number;
    angelScore: number;
    simioScore: number;
    streak: number;
}

export interface RankingEntry {
    id: string;
    name: string;
    avatar_url: string;
    xp: number;
    level: number;
    streak: number;
    rank: number;
    consciousness_rank: string;
}

export function useGamification() {
    const { session } = useAuth();
    const [stats, setStats] = useState<GamificationState>({
        level: 1,
        xp: 0,
        antiGravityScore: 0,
        progress: 0,
        rank: 'BRONZE',
        prestige: 0,
        consciousnessRank: 'BRONCE',
        consciousnessLevel: 1,
        angelScore: 0,
        simioScore: 0,
        streak: 0,
    });

    // Helper to keep Rank logic consistent locally
    const calculateRank = (score: number): 'BRONZE' | 'SILVER' | 'GOLD' | 'INFINITE' => {
        if (score >= 95) return 'INFINITE';
        if (score >= 75) return 'GOLD';
        if (score >= 50) return 'SILVER';
        return 'BRONZE';
    };

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
                .select('level, xp, anti_gravity_score, angel_score, simio_score, consciousness_rank, consciousness_level, current_streak')
                .eq('id', session.user.id)
                .single();

            if (data) {
                const angelScore = data.angel_score || 0;
                const simioScore = data.simio_score || 0;
                const antiGravityScore = data.anti_gravity_score || 0;
                const streak = data.current_streak || 0;

                const newState: GamificationState = {
                    level: data.level || 1,
                    xp: data.xp || 0,
                    antiGravityScore,
                    progress: getProgressToNextLevel(data.xp || 0),
                    rank: calculateRank(antiGravityScore),
                    prestige: 0,
                    consciousnessRank: (data.consciousness_rank as any) || 'BRONCE',
                    consciousnessLevel: data.consciousness_level || 1,
                    angelScore,
                    simioScore,
                    streak,
                };
                setStats(newState);
                await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(newState));
            }
        };

        loadCache();
        fetchStats();

        // Subscribe to realtime updates
        const channel = supabase
            .channel('gamification_updates')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${session.user.id}`,
                },
                async (payload) => {
                    const newData = payload.new;
                    if (newData) {
                        setStats(prev => {
                            const angelScore = newData.angel_score ?? prev.angelScore;
                            const simioScore = newData.simio_score ?? prev.simioScore;
                            const antiGravityScore = newData.anti_gravity_score ?? prev.antiGravityScore;
                            const streak = newData.current_streak ?? prev.streak;

                            return {
                                ...prev,
                                level: newData.level ?? prev.level,
                                xp: newData.xp ?? prev.xp,
                                antiGravityScore,
                                progress: getProgressToNextLevel(newData.xp ?? prev.xp),
                                rank: calculateRank(antiGravityScore),
                                consciousnessRank: (newData.consciousness_rank as any) ?? prev.consciousnessRank,
                                consciousnessLevel: newData.consciousness_level ?? prev.consciousnessLevel,
                                angelScore,
                                simioScore,
                                streak,
                            };
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [session?.user?.id]);

    const rebirth = async () => {
        // Mock Rebirth Logic for UI Demo
        const newState = {
            ...stats,
            level: 1,
            xp: 0,
            prestige: stats.prestige + 1,
            rank: 'BRONZE' as const,
            streak: 0
        };
        setStats(newState);
        // In real app, would call Supabase RPC 'rebirth_user'
    };

    const getLeaderboard = async (): Promise<RankingEntry[]> => {
        // Removed fields that might be missing in the schema to prevent crashes
        // We select basic fields. note: we removed 'current_streak' and 'name' to avoid 42703 error
        const { data, error } = await supabase
            .from('profiles')
            .select('id, arrow_url:avatar_url, xp, level, consciousness_rank')
            .order('xp', { ascending: false })
            .limit(50);

        if (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }

        if (!data || data.length === 0) {
            console.log('Leaderboard empty or no data');
            return [];
        }

        return data.map((user: any, index: number) => ({
            id: user.id,
            name: user.username || `Agente ${user.id?.slice(0, 4).toUpperCase()}` || 'Desconocido',
            avatar_url: user.arrow_url || user.avatar_url,
            xp: user.xp || 0,
            level: user.level || 1,
            streak: 0, // Fallback safe
            rank: index + 1,
            consciousness_rank: (user.consciousness_rank as any) || 'BRONCE'
        }));
    };

    return { ...stats, rebirth, getLeaderboard };
}
