import { GradientBackground } from '@/components/ui/GradientBackground';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SkiaGlassPane } from '@/components/ui/SkiaGlassPane';
import { FRAMES } from '@/constants/frames';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LeaderboardScreen() {
    const { user } = useAuth();
    const { level, xp, consciousnessRank, streak } = useGamification();

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
        <SafeAreaView className="flex-1 bg-deep-black">
            <GradientBackground>
                {/* Header */}
                <Animated.View
                    entering={FadeInDown.duration(600).springify()}
                    className="pt-4 pb-6 px-4 border-b border-white/5 bg-black/20"
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
                        <View className="bg-white/5 py-1 px-3 rounded-full border border-white/10">
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
                                        {/* Frame Image */}
                                        {currentFrame?.image && (
                                            <Image
                                                source={currentFrame.image}
                                                style={{ width: 140, height: 140, position: 'absolute', zIndex: 10 }} // Increased size for prominence
                                                contentFit="contain"
                                            />
                                        )}

                                        {/* Avatar Image */}
                                        <View className="w-24 h-24 rounded-2xl overflow-hidden bg-black/40 border-2 border-white/10">
                                            <Image
                                                source={user?.user_metadata?.avatar_url
                                                    ? { uri: user.user_metadata.avatar_url }
                                                    : require('@/assets/images/simio_angel_concept.png')
                                                }
                                                style={{ width: '100%', height: '100%' }}
                                                contentFit="cover"
                                            />
                                        </View>

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
                    <View className="px-6 opacity-60">
                        <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-4">PRÓXIMAMENTE</Text>
                        {[1, 2, 3].map((_, i) => (
                            <View key={i} className="mb-3 flex-row items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                <View className="w-8 h-8 rounded-full bg-white/5 items-center justify-center">
                                    <Text className="text-gray-500 font-bold">{i + 2}</Text>
                                </View>
                                <View className="h-2 w-24 bg-white/10 rounded-full" />
                                <View className="ml-auto w-16 h-2 bg-white/5 rounded-full" />
                            </View>
                        ))}
                    </View>

                </ScrollView>
            </GradientBackground>
        </SafeAreaView>
    );
}
