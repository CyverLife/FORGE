import { GradientBackground } from '@/components/ui/GradientBackground';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SkiaGlassPane } from '@/components/ui/SkiaGlassPane';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { FRAMES } from '@/constants/frames';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LeaderboardScreen() {
    const { user } = useAuth();
    const { level, xp, consciousnessRank, streak } = useGamification();
    const insets = useSafeAreaInsets();

    // ... existing code ...

    // Get current frame
    const currentFrameId = user?.user_metadata?.frame_id || 'default';
    const currentFrame = FRAMES.find(f => f.id === currentFrameId);

    // Determine colors based on rank
    const getRankColors = (rank: string) => {
        switch (rank) {
            case 'ORO': return { text: 'text-yellow-400', border: 'border-yellow-500/50', bg: 'bg-yellow-500/20', shadow: 'shadow-yellow-500/50', glow: 'rgba(234, 179, 8, 0.5)' };
            case 'PLATA': return { text: 'text-gray-300', border: 'border-gray-400/50', bg: 'bg-gray-400/20', shadow: 'shadow-gray-400/50', glow: 'rgba(156, 163, 175, 0.5)' };
            case 'INFINITO': return { text: 'text-purple-400', border: 'border-purple-500/50', bg: 'bg-purple-500/20', shadow: 'shadow-purple-500/50', glow: 'rgba(168, 85, 247, 0.5)' };
            default: return { text: 'text-orange-500', border: 'border-orange-500/50', bg: 'bg-orange-500/20', shadow: 'shadow-orange-500/50', glow: 'rgba(249, 115, 22, 0.5)' }; // BRONCE
        }
    };

    const colors = getRankColors(consciousnessRank);

    return (
        <View style={{ flex: 1, backgroundColor: '#09090B', paddingTop: insets.top }}>
            <GradientBackground>
                {/* Header */}
                <Animated.View
                    entering={FadeInDown.duration(600).springify()}
                    className="pt-12 pb-6 px-4 border-b border-white/5 bg-black/20"
                >
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <View className={`w-10 h-10 rounded-full items-center justify-center border ${colors.border} ${colors.bg}`}>
                                <IconSymbol name="trophy.fill" size={20} color={colors.glow.replace(/[\d.]+\)$/, '1)')} />
                            </View>
                            <View>
                                <Text className="text-white font-black text-xl uppercase tracking-wider font-display">RANKING</Text>
                                <Text className={`text-xs font-bold ${colors.text} tracking-widest`}>TEMPORADA 1</Text>
                            </View>
                        </View>
                        <View className="bg-white/5 py-1 px-3 rounded-full border border-white/10 mt-2">
                            <Text className="text-white/70 text-[10px] font-bold">GLOBAL</Text>
                        </View>
                    </View>
                </Animated.View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                    {/* Your Ranked Card */}
                    <Animated.View
                        entering={FadeInRight.delay(200).springify()}
                        className="mx-4 mt-8 mb-8"
                    >
                        <View className="relative">
                            {/* Glow Effect */}
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 20,
                                    left: 20,
                                    right: 20,
                                    bottom: 20,
                                    backgroundColor: colors.glow,
                                    opacity: 0.3,
                                    borderRadius: 30,
                                    shadowColor: colors.glow,
                                    shadowOffset: { width: 0, height: 0 },
                                    shadowOpacity: 0.8,
                                    shadowRadius: 20,
                                }}
                            />

                            <SkiaGlassPane
                                height={260}
                                cornerRadius={30}
                                backgroundColor="rgba(20, 20, 25, 0.85)"
                                borderColor={colors.glow}
                                borderWidth={1}
                            >
                                <View className="p-6 items-center w-full h-full justify-between">

                                    {/* Top Badge */}
                                    <View className={`px-4 py-1.5 rounded-full border ${colors.border} ${colors.bg} mb-4`}>
                                        <Text className={`${colors.text} font-black text-xs tracking-[0.2em] uppercase`}>
                                            RANGO {consciousnessRank}
                                        </Text>
                                    </View>

                                    {/* Avatar & Frame */}
                                    <View className="items-center justify-center relative mb-4">
                                        <UserAvatar
                                            url={user?.user_metadata?.avatar_url}
                                            frame={currentFrame}
                                            size={140}
                                        />

                                        {/* Rank Badge Indicator */}
                                        <View className={`absolute -bottom-3 bg-[#0E0E0E] px-3 py-1 rounded-lg border ${colors.border} z-20`}>
                                            <Text className="text-white font-bold text-xs">Nvl. {level}</Text>
                                        </View>
                                    </View>

                                    {/* Name & Stats */}
                                    <View className="items-center w-full">
                                        <Text className="text-white font-black text-2xl font-display tracking-wide mb-1">
                                            {user?.user_metadata?.name || 'Iniciado'}
                                        </Text>

                                        <View className="flex-row items-center gap-6 mt-2">
                                            <View className="items-center">
                                                <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">EXPERIENCIA</Text>
                                                <Text className="text-white font-bold text-lg">{Math.floor(xp)} <Text className="text-gray-500 text-xs">XP</Text></Text>
                                            </View>
                                            <View className="w-[1px] h-8 bg-white/10" />
                                            <View className="items-center">
                                                <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">RACHA</Text>
                                                <Text className={`${colors.text} font-bold text-lg`}>{streak} <Text className="text-gray-500 text-xs">DÍAS</Text></Text>
                                            </View>
                                        </View>
                                    </View>

                                </View>
                            </SkiaGlassPane>
                        </View>
                    </Animated.View>

                    {/* Coming Soon Section */}
                    {/* Global Leaderboard - TOP AGENTS */}
                    <View className="px-6 mb-12">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest">TOP AGENTES GLOBALES</Text>
                            <TouchableOpacity>
                                <Text className="text-forge-orange text-[10px] font-bold uppercase">VER TODOS</Text>
                            </TouchableOpacity>
                        </View>

                        {[
                            { rank: 1, name: 'CYBERMONK', score: 9850, streak: 142, color: 'text-yellow-400', border: 'border-yellow-500/50' },
                            { rank: 2, name: 'NEON_NINJA', score: 8720, streak: 89, color: 'text-gray-300', border: 'border-gray-400/50' },
                            { rank: 3, name: 'VOID_WALKER', score: 8450, streak: 76, color: 'text-orange-400', border: 'border-orange-500/50' },
                            { rank: 4, name: 'ZEN_MASTER', score: 7200, streak: 45, color: 'text-white/60', border: 'border-white/10' },
                            { rank: 5, name: 'QUANTUM_LZ', score: 6980, streak: 32, color: 'text-white/60', border: 'border-white/10' },
                        ].map((agent, i) => (
                            <View
                                key={i}
                                className={`flex-row items-center bg-white/5 p-4 rounded-xl border mb-3 ${agent.border} ${i < 3 ? 'bg-gradient-to-r from-white/10 to-transparent' : 'border-white/5'}`}
                            >
                                <View className="w-8 items-center justify-center mr-4">
                                    <Text className={`font-black text-lg ${agent.color} font-display italic`}>#{agent.rank}</Text>
                                </View>

                                {/* Generic Avatar Placeholder since we don't have URLs for them */}
                                <View className={`w-10 h-10 rounded-lg items-center justify-center border ${agent.border} bg-white/5 mr-4`}>
                                    <Text className="text-white font-bold text-xs">{agent.name.substring(0, 2)}</Text>
                                </View>

                                <View className="flex-1">
                                    <Text className={`font-bold text-sm ${i < 3 ? 'text-white' : 'text-gray-400'} tracking-wide`}>{agent.name}</Text>
                                    <Text className="text-xs text-gray-600 font-medium">Nivel {Math.floor(agent.score / 1000) + 10} • {agent.streak} días racha</Text>
                                </View>

                                <View>
                                    <Text className="text-white font-bold text-sm">{agent.score.toLocaleString()}</Text>
                                    <Text className="text-[8px] text-right text-forge-orange font-bold uppercase">XP</Text>
                                </View>
                            </View>
                        ))}
                    </View>


                </ScrollView>
            </GradientBackground>
        </View>
    );
}
