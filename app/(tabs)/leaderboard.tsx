import { GradientBackground } from '@/components/ui/GradientBackground';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SkiaGlassPane } from '@/components/ui/SkiaGlassPane';
import { SkiaHexagonAvatar } from '@/components/ui/SkiaHexagonAvatar';
import { useAuth } from '@/hooks/useAuth';
import { RankingEntry, useGamification } from '@/hooks/useGamification';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LeaderboardScreen() {
    const { user } = useAuth();
    const { getLeaderboard, consciousnessRank } = useGamification();
    const insets = useSafeAreaInsets();
    const [leaderboard, setLeaderboard] = useState<RankingEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchLeaderboard = async () => {
        const data = await getLeaderboard();
        setLeaderboard(data);
        setLoading(false);
        setRefreshing(false);
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchLeaderboard();
    };

    const topThree = leaderboard.slice(0, 3);
    const restOfUsers = leaderboard.slice(3);

    const currentUserRank = leaderboard.find(u => u.id === user?.id);

    return (
        <View style={{ flex: 1, backgroundColor: '#09090B' }}>
            <GradientBackground>
                <View style={{ flex: 1, paddingTop: insets.top }}>
                    {/* Header */}
                    <Animated.View
                        entering={FadeInDown.duration(600).springify()}
                        className="pt-6 pb-6 px-4 border-b border-white/5 bg-black/20"
                    >
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-3">
                                <IconSymbol name="trophy.fill" size={24} color="#F97316" />
                                <View>
                                    <Text className="text-white font-black text-2xl uppercase tracking-wider font-display">RANKING</Text>
                                    <Text className="text-forge-orange text-[10px] font-bold tracking-[0.2em] uppercase">TEMPORADA 1</Text>
                                </View>
                            </View>
                            <View className="bg-white/5 py-1 px-3 rounded-full border border-white/10">
                                <Text className="text-white/70 text-[10px] font-bold">GLOBAL</Text>
                            </View>
                        </View>
                    </Animated.View>

                    {loading ? (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator size="large" color="#F97316" />
                        </View>
                    ) : (
                        <ScrollView
                            className="flex-1"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F97316" />}
                        >
                            {/* Top 3 Podium */}
                            <View className="flex-row items-end justify-center mt-8 mb-12 h-64">
                                {/* 2nd Place */}
                                {topThree[1] && (
                                    <Animated.View entering={FadeInUp.delay(100).springify()} className="items-center -mr-4 z-10">
                                        <View className="mb-2">
                                            <SkiaHexagonAvatar size={80} url={topThree[1].avatar_url} borderColor="#9CA3AF" borderWidth={2} />
                                            <View className="absolute -bottom-3 self-center bg-gray-600 px-2 py-0.5 rounded-full border border-white/20">
                                                <Text className="text-white font-bold text-[10px]">#2</Text>
                                            </View>
                                        </View>
                                        <Text className="text-gray-300 font-bold text-xs mt-3 mb-1 w-20 text-center" numberOfLines={1}>{topThree[1].name}</Text>
                                        <Text className="text-gray-500 text-[10px] font-mono">{topThree[1].xp} XP</Text>
                                        <View className="h-24 w-20 bg-gray-800/30 rounded-t-lg border-t border-gray-600/30 mt-2" />
                                    </Animated.View>
                                )}

                                {/* 1st Place */}
                                {topThree[0] && (
                                    <Animated.View entering={FadeInUp.delay(0).springify()} className="items-center z-20 mx-2 -mb-2">
                                        <View className="mb-3 relative">
                                            <IconSymbol name="crown.fill" size={24} color="#FACC15" style={{ position: 'absolute', top: -24, left: 32, zIndex: 10 }} />
                                            <SkiaHexagonAvatar size={110} url={topThree[0].avatar_url} borderColor="#FACC15" borderWidth={3} />
                                            <View className="absolute -bottom-3 self-center bg-yellow-500 px-3 py-1 rounded-full border border-white/20 shadow-lg shadow-yellow-500/50">
                                                <Text className="text-black font-black text-xs">#1</Text>
                                            </View>
                                        </View>
                                        <Text className="text-yellow-400 font-bold text-sm mt-4 mb-1 w-28 text-center" numberOfLines={1}>{topThree[0].name}</Text>
                                        <Text className="text-yellow-600/80 text-[10px] font-mono font-bold">{topThree[0].xp} XP</Text>
                                        <View className="h-32 w-24 bg-yellow-500/10 rounded-t-xl border-t border-yellow-500/30 mt-2 relative overflow-hidden">
                                            <View className="absolute inset-0 bg-gradient-to-b from-yellow-500/20 to-transparent" />
                                        </View>
                                    </Animated.View>
                                )}

                                {/* 3rd Place */}
                                {topThree[2] && (
                                    <Animated.View entering={FadeInUp.delay(200).springify()} className="items-center -ml-4 z-10">
                                        <View className="mb-2">
                                            <SkiaHexagonAvatar size={80} url={topThree[2].avatar_url} borderColor="#B45309" borderWidth={2} />
                                            <View className="absolute -bottom-3 self-center bg-amber-700 px-2 py-0.5 rounded-full border border-white/20">
                                                <Text className="text-white font-bold text-[10px]">#3</Text>
                                            </View>
                                        </View>
                                        <Text className="text-amber-500 font-bold text-xs mt-3 mb-1 w-20 text-center" numberOfLines={1}>{topThree[2].name}</Text>
                                        <Text className="text-amber-700 text-[10px] font-mono">{topThree[2].xp} XP</Text>
                                        <View className="h-20 w-20 bg-amber-900/20 rounded-t-lg border-t border-amber-700/30 mt-2" />
                                    </Animated.View>
                                )}
                            </View>

                            {/* List */}
                            {leaderboard.length === 0 ? (
                                <View className="flex-1 items-center justify-center py-20">
                                    <IconSymbol name="person.3.fill" size={48} color="#333" />
                                    <Text className="text-white/30 text-center mt-4 font-bold">No hay agentes visualizados</Text>
                                    <Text className="text-white/20 text-center text-xs mt-2">Sé el primero en forjar tu destino</Text>
                                </View>
                            ) : (
                                <View className="px-4">
                                    {restOfUsers.map((item, index) => (
                                        <Animated.View
                                            key={item.id}
                                            entering={FadeInDown.delay(index * 50 + 300)}
                                            className="mb-3"
                                        >
                                            <SkiaGlassPane
                                                height={72}
                                                cornerRadius={16}
                                                backgroundColor={item.id === user?.id ? "rgba(249, 115, 22, 0.15)" : "rgba(255, 255, 255, 0.03)"}
                                                borderColor={item.id === user?.id ? "rgba(249, 115, 22, 0.4)" : "rgba(255, 255, 255, 0.08)"}
                                                borderWidth={item.id === user?.id ? 1 : 0.5}
                                            >
                                                <View className="flex-row items-center h-full px-4 gap-4">
                                                    <Text className="text-white/50 font-bold font-mono w-6 text-center">{item.rank}</Text>

                                                    <SkiaHexagonAvatar size={48} url={item.avatar_url} borderColor={item.id === user?.id ? "#F97316" : "#333"} borderWidth={1} />

                                                    <View className="flex-1">
                                                        <Text className={`font-bold text-sm ${item.id === user?.id ? 'text-white' : 'text-gray-300'}`}>{item.name}</Text>
                                                        <Text className="text-[10px] text-gray-500 uppercase tracking-wider">{item.consciousness_rank}</Text>
                                                    </View>

                                                    <View className="items-end">
                                                        <Text className="text-white font-bold font-mono">{item.xp.toLocaleString()}</Text>
                                                        <Text className="text-[8px] text-gray-500">XP</Text>
                                                    </View>
                                                </View>
                                            </SkiaGlassPane>
                                        </Animated.View>
                                    ))}
                                </View>
                            )}
                            {currentUserRank && currentUserRank.rank > 3 && (
                                <View className="mt-8 mx-4 mb-8">
                                    <Text className="text-white/30 text-center text-[10px] uppercase tracking-widest mb-3">Tu Posición</Text>
                                    <SkiaGlassPane height={80} cornerRadius={20} backgroundColor="rgba(249, 115, 22, 0.2)" borderColor="#F97316" borderWidth={1}>
                                        <View className="flex-row items-center h-full px-5 gap-4">
                                            <View className="w-8 h-8 rounded-full bg-forge-orange items-center justify-center">
                                                <Text className="text-black font-black">{currentUserRank.rank}</Text>
                                            </View>
                                            <SkiaHexagonAvatar size={50} url={currentUserRank.avatar_url} borderColor="#F97316" borderWidth={2} />
                                            <View className="flex-1">
                                                <Text className="text-white font-bold text-lg">TÚ</Text>
                                                <Text className="text-forge-orange text-xs uppercase tracking-wider font-bold">Nivel {currentUserRank.level}</Text>
                                            </View>
                                            <View className="items-end">
                                                <Text className="text-white font-black text-xl font-display">{currentUserRank.xp.toLocaleString()}</Text>
                                                <Text className="text-white/50 text-[10px]">XP TOTAL</Text>
                                            </View>
                                        </View>
                                    </SkiaGlassPane>
                                </View>
                            )}
                        </ScrollView>
                    )}
                </View>
            </GradientBackground>
        </View>
    );
}
