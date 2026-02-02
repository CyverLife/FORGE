import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { GlassPane } from '../ui/GlassPane';

interface Profile {
    id: string;
    username: string;
    avatar_url: string | null;
    anti_gravity_score: number;
    level: number;
}

export const Leaderboard = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, anti_gravity_score, level')
            .order('anti_gravity_score', { ascending: false })
            .limit(50); // Get top 50

        if (data) setProfiles(data);
        setLoading(false);
    };

    const getLeague = (score: number) => {
        if (score >= 95) return { name: 'INFINITE (Top 1%)', color: '#E0F2FE' };
        if (score >= 75) return { name: 'GOLD (5-8%)', color: '#FACC15' };
        if (score >= 50) return { name: 'SILVER (25%)', color: '#94A3B8' };
        return { name: 'BRONZE (60%)', color: '#B45309' };
    };

    const renderItem = ({ item, index }: { item: Profile; index: number }) => {
        const league = getLeague(item.anti_gravity_score);
        return (
            <GlassPane className="mb-3 p-4 rounded-xl flex-row items-center border border-white/5" opacity={0.05} blurAmount={4}>
                <View className="w-8 items-center mr-2">
                    <Text className={`font-bold text-lg ${index < 3 ? 'text-magma' : 'text-gray-500'}`}>#{index + 1}</Text>
                </View>

                {/* Avatar */}
                <View className="w-10 h-10 rounded-full bg-gray-700 mr-3 overflow-hidden border border-white/10">
                    {item.avatar_url ? (
                        <Image source={{ uri: item.avatar_url }} className="w-full h-full" />
                    ) : (
                        <View className="items-center justify-center h-full w-full bg-white/5">
                            <Text className="text-white text-xs">{item.username?.substring(0, 2).toUpperCase()}</Text>
                        </View>
                    )}
                </View>

                <View className="flex-1">
                    <Text className="text-white font-bold text-base">{item.username || 'Anonymous Forger'}</Text>
                    <Text style={{ color: league.color }} className="text-[10px] font-bold tracking-widest">{league.name}</Text>
                </View>

                <View className="items-end">
                    <Text className="text-white font-black text-xl">{item.anti_gravity_score}</Text>
                    <Text className="text-gray-500 text-[10px]">AG SCORE</Text>
                </View>
            </GlassPane>
        );
    };

    return (
        <View className="flex-1 w-full mt-4">
            <View className="mb-6 items-center">
                <Text className="text-white font-bold text-2xl tracking-[4px]">ASCENSION BOARD</Text>
                <Text className="text-magma text-xs tracking-widest uppercase">Global Hierarchy</Text>
            </View>

            <FlatList
                data={profiles}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={
                    <Text className="text-gray-500 text-center mt-10">Syncing with the Cosmos...</Text>
                }
            />
        </View>
    );
};
