import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGamification } from '@/hooks/useGamification';
import { useHabits } from '@/hooks/useHabits';
import React, { useMemo } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
    const { habits } = useHabits();
    const { antiGravityScore, consciousnessRank, angelScore, simioScore } = useGamification();

    // Data Calculation: Attribute Distribution
    const attributeStats = useMemo(() => {
        const total = habits.length || 1;
        return {
            FIRE: habits.filter(h => h.attribute === 'FIRE').length,
            IRON: habits.filter(h => h.attribute === 'IRON').length,
            STEEL: habits.filter(h => h.attribute === 'STEEL').length,
            FOCUS: habits.filter(h => h.attribute === 'FOCUS').length,
        };
    }, [habits]);

    // Coherence calculation
    const coherence = useMemo(() => {
        const total = angelScore + simioScore;
        if (total === 0) return 50;
        return Math.round((angelScore / total) * 100);
    }, [angelScore, simioScore]);

    return (
        <SafeAreaView className="flex-1 bg-deep-black">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                {/* Header */}
                <Animated.View
                    entering={FadeInDown.delay(0).springify()}
                    className="pt-12 pb-6 px-4 border-b border-border-subtle"
                >
                    <View className="flex-row items-center gap-3 mb-2">
                        <IconSymbol name="chart.bar.fill" size={28} color="#F97316" />
                        <Text className="text-text-primary font-black text-3xl uppercase tracking-wider font-display">
                            ESTADÍSTICAS
                        </Text>
                    </View>
                    <Text className="text-text-secondary text-sm">
                        Análisis de tu progreso
                    </Text>
                </Animated.View>

                {/* Consciousness Rank Card */}
                <Animated.View
                    entering={FadeInDown.delay(100).springify()}
                    className="mx-4 mt-6 bg-card-black p-6 rounded-card border border-border-subtle"
                >
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-text-secondary text-xs uppercase tracking-wider font-bold">
                            Rango de Consciencia
                        </Text>
                        <IconSymbol name="brain" size={20} color="#F97316" />
                    </View>
                    <Text className="text-text-primary font-black text-4xl mb-2 font-display">
                        {consciousnessRank}
                    </Text>
                    <Text className="text-text-tertiary text-sm">
                        {consciousnessRank === 'BRONCE' && 'Reactividad - Gratificación inmediata'}
                        {consciousnessRank === 'PLATA' && 'Ego - Comparación y estatus'}
                        {consciousnessRank === 'ORO' && 'Propósito - Valores intrínsecos'}
                        {consciousnessRank === 'INFINITO' && 'Desapego - Placer del camino'}
                    </Text>
                </Animated.View>

                {/* Angel vs Simio - Dualidad */}
                <Animated.View
                    entering={FadeInDown.delay(150).springify()}
                    className="mx-4 mt-6 bg-card-black p-6 rounded-card border border-border-subtle"
                >
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-text-secondary text-xs uppercase tracking-wider font-bold">
                            Ángel vs Simio
                        </Text>
                        <Text className="text-forge-orange text-xs font-bold">
                            Coherencia: {coherence}%
                        </Text>
                    </View>

                    {/* Dual Bars */}
                    <View className="gap-4">
                        {/* Angel */}
                        <View>
                            <View className="flex-row items-center justify-between mb-2">
                                <View className="flex-row items-center gap-2">
                                    <Text className="text-2xl">😇</Text>
                                    <Text className="text-text-primary font-bold">El Ángel</Text>
                                </View>
                                <Text className="text-text-primary font-bold">{angelScore}</Text>
                            </View>
                            <View className="h-3 bg-border-subtle rounded-full overflow-hidden">
                                <View
                                    className="h-full bg-blue-500"
                                    style={{ width: `${coherence}%` }}
                                />
                            </View>
                            <Text className="text-text-tertiary text-xs mt-1">
                                Disciplina, enfoque, propósito
                            </Text>
                        </View>

                        {/* Simio */}
                        <View>
                            <View className="flex-row items-center justify-between mb-2">
                                <View className="flex-row items-center gap-2">
                                    <Text className="text-2xl">🐒</Text>
                                    <Text className="text-text-primary font-bold">El Simio</Text>
                                </View>
                                <Text className="text-text-primary font-bold">{simioScore}</Text>
                            </View>
                            <View className="h-3 bg-border-subtle rounded-full overflow-hidden">
                                <View
                                    className="h-full bg-orange-500"
                                    style={{ width: `${100 - coherence}%` }}
                                />
                            </View>
                            <Text className="text-text-tertiary text-xs mt-1">
                                Impulsividad, procrastinación, gratificación
                            </Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Attribute Distribution */}
                <Animated.View
                    entering={FadeInDown.delay(200).springify()}
                    className="mx-4 mt-6 bg-card-black p-6 rounded-card border border-border-subtle"
                >
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-text-secondary text-xs uppercase tracking-wider font-bold">
                            Distribución de Atributos
                        </Text>
                        <Text className="text-text-tertiary text-xs">
                            {habits.length} protocolos
                        </Text>
                    </View>

                    <View className="gap-4">
                        {[
                            { key: 'FIRE', label: 'FUEGO', icon: 'flame.fill', color: '#EF4444' },
                            { key: 'IRON', label: 'HIERRO', icon: 'hammer.fill', color: '#6B7280' },
                            { key: 'STEEL', label: 'ACERO', icon: 'shield.fill', color: '#9CA3AF' },
                            { key: 'FOCUS', label: 'FOCO', icon: 'eye.fill', color: '#3B82F6' },
                        ].map((attr) => {
                            const count = attributeStats[attr.key as keyof typeof attributeStats];
                            const percentage = habits.length ? (count / habits.length) * 100 : 0;

                            return (
                                <View key={attr.key}>
                                    <View className="flex-row items-center justify-between mb-2">
                                        <View className="flex-row items-center gap-2">
                                            <IconSymbol name={attr.icon as any} size={16} color={attr.color} />
                                            <Text className="text-text-primary font-bold text-sm">
                                                {attr.label}
                                            </Text>
                                        </View>
                                        <Text className="text-text-secondary text-sm font-mono">
                                            {count}
                                        </Text>
                                    </View>
                                    <View className="h-2 bg-border-subtle rounded-full overflow-hidden">
                                        <View
                                            className="h-full"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: attr.color
                                            }}
                                        />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </Animated.View>

                {/* Anti-Gravity Score */}
                <Animated.View
                    entering={FadeInDown.delay(250).springify()}
                    className="mx-4 mt-6 mb-8 bg-card-black p-6 rounded-card border border-border-subtle"
                >
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-text-secondary text-xs uppercase tracking-wider font-bold">
                            Puntuación Anti-Gravedad
                        </Text>
                        <IconSymbol name="arrow.up.circle.fill" size={20} color="#FACC15" />
                    </View>
                    <Text className="text-text-primary font-black text-5xl mb-2 font-display">
                        {Math.round(antiGravityScore)}
                    </Text>
                    <View className="h-3 bg-border-subtle rounded-full overflow-hidden">
                        <View
                            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                            style={{ width: `${antiGravityScore}%`, backgroundColor: '#FACC15' }}
                        />
                    </View>
                    <Text className="text-text-tertiary text-sm mt-2">
                        Tu capacidad de elevarte sobre la gravedad del caos
                    </Text>
                </Animated.View>

                <View className="h-24" />

            </ScrollView>
        </SafeAreaView>
    );
}
