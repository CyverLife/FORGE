import { GradientBackground } from '@/components/ui/GradientBackground';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SkiaGlassPane } from '@/components/ui/SkiaGlassPane';
import { useGamification } from '@/hooks/useGamification';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LeaderboardScreen() {
    const { level, xp, consciousnessRank } = useGamification();

    return (
        <SafeAreaView className="flex-1 bg-deep-black">
            <GradientBackground>
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                    {/* Header */}
                    <Animated.View
                        entering={FadeInDown.delay(0).springify()}
                        className="pt-12 pb-6 px-4 border-b border-border-subtle"
                    >
                        <View className="flex-row items-center gap-3 mb-2">
                            <IconSymbol name="trophy.fill" size={28} color="#F97316" />
                            <Text className="text-text-primary font-black text-3xl uppercase tracking-wider font-display">
                                RANKING
                            </Text>
                        </View>
                        <Text className="text-text-secondary text-sm font-label">
                            Logros y clasificación global
                        </Text>
                    </Animated.View>

                    {/* Your Stats Card */}
                    <Animated.View
                        entering={FadeInDown.delay(100).springify()}
                        className="mx-4 mt-6"
                    >
                        <SkiaGlassPane
                            height={undefined}
                            cornerRadius={20}
                            backgroundColor="rgba(20, 20, 23, 0.6)"
                            shadowColor="rgba(249, 115, 22, 0.2)"
                            borderColor="rgba(249, 115, 22, 0.5)"
                            borderWidth={1}
                        >
                            <View className="p-6">
                                <View className="flex-row items-center justify-between mb-4">
                                    <Text className="text-text-secondary text-xs uppercase tracking-wider font-bold font-label">
                                        Tu Posición
                                    </Text>
                                    <View className="bg-forge-orange/10 px-3 py-1 rounded-full border border-forge-orange/30">
                                        <Text className="text-forge-orange font-bold text-xs font-mono">
                                            {consciousnessRank}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center gap-4">
                                    <View className="w-16 h-16 rounded-full bg-forge-orange/20 border border-forge-orange/50 items-center justify-center">
                                        <Text className="text-4xl shadow-sm">🥚</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-text-primary font-black text-xl font-display uppercase">
                                            JUGADOR_UNO
                                        </Text>
                                        <Text className="text-text-secondary text-sm font-label">
                                            Nivel {level} • {Math.floor(xp)} XP
                                        </Text>
                                    </View>
                                    <Text className="text-forge-orange font-black text-4xl font-display" style={{ textShadowColor: '#F97316', textShadowRadius: 10 }}>
                                        #1
                                    </Text>
                                </View>
                            </View>
                        </SkiaGlassPane>
                    </Animated.View>

                    {/* Coming Soon */}
                    <Animated.View
                        entering={FadeInDown.delay(200).springify()}
                        className="flex-1 items-center justify-center p-8 mt-12"
                    >
                        <View className="w-32 h-32 rounded-full bg-black/30 items-center justify-center mb-6 border border-white/5 shadow-2xl">
                            <IconSymbol name="trophy.fill" size={64} color="#F97316" />
                        </View>
                        <Text className="text-text-primary font-bold text-2xl text-center mb-3 font-display tracking-widest">
                            PRÓXIMAMENTE
                        </Text>
                        <Text className="text-text-secondary text-center max-w-sm leading-relaxed font-label">
                            Sistema de ranking global, logros desbloqueables, y competencia con otros forjadores
                        </Text>

                        {/* Feature List */}
                        <View className="mt-8 gap-3 w-full max-w-sm">
                            {[
                                { icon: 'person.3.fill', text: 'Clasificación global' },
                                { icon: 'star.fill', text: 'Logros y badges' },
                                { icon: 'flame.fill', text: 'Rachas competitivas' },
                                { icon: 'chart.line.uptrend.xyaxis', text: 'Progreso comparativo' },
                            ].map((item, i) => (
                                <Animated.View
                                    key={i}
                                    entering={FadeInDown.delay(300 + (i * 50)).springify()}
                                >
                                    <SkiaGlassPane
                                        height={undefined}
                                        cornerRadius={12}
                                        backgroundColor="rgba(255,255,255,0.03)"
                                        borderColor="rgba(255,255,255,0.05)"
                                        borderWidth={0.5}
                                    >
                                        <View className="flex-row items-center gap-3 p-4">
                                            <IconSymbol name={item.icon as any} size={20} color="#9CA3AF" />
                                            <Text className="text-text-secondary font-label font-bold">
                                                {item.text}
                                            </Text>
                                        </View>
                                    </SkiaGlassPane>
                                </Animated.View>
                            ))}
                        </View>
                    </Animated.View>

                    <View className="h-24" />

                </ScrollView>
            </GradientBackground>
        </SafeAreaView>
    );
}
