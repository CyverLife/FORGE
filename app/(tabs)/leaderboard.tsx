import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGamification } from '@/hooks/useGamification';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LeaderboardScreen() {
    const { level, xp, consciousnessRank } = useGamification();

    return (
        <SafeAreaView className="flex-1 bg-deep-black">
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
                    <Text className="text-text-secondary text-sm">
                        Logros y clasificación global
                    </Text>
                </Animated.View>

                {/* Your Stats Card */}
                <Animated.View
                    entering={FadeInDown.delay(100).springify()}
                    className="mx-4 mt-6 bg-card-black p-6 rounded-card border-2 border-forge-orange"
                >
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-text-secondary text-xs uppercase tracking-wider font-bold">
                            Tu Posición
                        </Text>
                        <View className="bg-forge-orange/20 px-3 py-1 rounded-full">
                            <Text className="text-forge-orange font-bold text-xs">
                                {consciousnessRank}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center gap-4">
                        <View className="w-16 h-16 rounded-full bg-forge-orange items-center justify-center">
                            <Text className="text-4xl">🥚</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-text-primary font-black text-xl font-display">
                                JUGADOR_UNO
                            </Text>
                            <Text className="text-text-secondary text-sm">
                                Nivel {level} • {Math.floor(xp)} XP
                            </Text>
                        </View>
                        <Text className="text-forge-orange font-black text-3xl font-display">
                            #1
                        </Text>
                    </View>
                </Animated.View>

                {/* Coming Soon */}
                <Animated.View
                    entering={FadeInDown.delay(200).springify()}
                    className="flex-1 items-center justify-center p-8 mt-12"
                >
                    <View className="w-32 h-32 rounded-full bg-card-black items-center justify-center mb-6 border border-border-subtle">
                        <IconSymbol name="trophy.fill" size={64} color="#F97316" />
                    </View>
                    <Text className="text-text-primary font-bold text-2xl text-center mb-3 font-display">
                        PRÓXIMAMENTE
                    </Text>
                    <Text className="text-text-secondary text-center max-w-sm leading-relaxed">
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
                                className="flex-row items-center gap-3 bg-card-black p-4 rounded-card border border-border-subtle"
                            >
                                <IconSymbol name={item.icon as any} size={20} color="#6B7280" />
                                <Text className="text-text-secondary">
                                    {item.text}
                                </Text>
                            </Animated.View>
                        ))}
                    </View>
                </Animated.View>

                <View className="h-24" />

            </ScrollView>
        </SafeAreaView>
    );
}
