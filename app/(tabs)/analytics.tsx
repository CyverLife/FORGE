import { GradientBackground } from '@/components/ui/GradientBackground';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PortalView } from '@/components/ui/PortalView';
import { SkiaGlassPane } from '@/components/ui/SkiaGlassPane';
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
            <GradientBackground>
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
                        className="mx-4 mt-6"
                    >
                        <SkiaGlassPane
                            height={undefined} // Let flex handle it
                            cornerRadius={20}
                            backgroundColor="rgba(20, 20, 23, 0.6)"
                            shadowColor="rgba(249, 115, 22, 0.15)"
                            borderColor="rgba(249, 115, 22, 0.2)"
                            borderWidth={0.5}
                        >
                            <View className="p-6">
                                <View className="flex-row items-center justify-between mb-4">
                                    <Text className="text-text-secondary text-xs uppercase tracking-wider font-bold font-label">
                                        Rango de Consciencia
                                    </Text>
                                    <IconSymbol name="brain" size={20} color="#F97316" />
                                </View>
                                <Text className="text-text-primary font-black text-4xl mb-2 font-display">
                                    {consciousnessRank}
                                </Text>
                                <Text className="text-text-tertiary text-sm font-label">
                                    {consciousnessRank === 'BRONCE' && 'Reactividad - Gratificación inmediata'}
                                    {consciousnessRank === 'PLATA' && 'Ego - Comparación y estatus'}
                                    {consciousnessRank === 'ORO' && 'Propósito - Valores intrínsecos'}
                                    {consciousnessRank === 'INFINITO' && 'Desapego - Placer del camino'}
                                </Text>
                            </View>
                        </SkiaGlassPane>
                    </Animated.View>

                    {/* Angel vs Simio - Dualidad */}
                    <Animated.View
                        entering={FadeInDown.delay(150).springify()}
                        className="mx-4 mt-6"
                    >
                        <SkiaGlassPane
                            height={undefined}
                            cornerRadius={20}
                            backgroundColor="rgba(20, 20, 23, 0.6)"
                            shadowColor="rgba(59, 130, 246, 0.15)"
                            borderColor="rgba(255, 255, 255, 0.1)"
                        >
                            <View className="py-2">
                                <PortalView />
                            </View>
                        </SkiaGlassPane>
                    </Animated.View>

                    {/* Attribute Distribution */}
                    <Animated.View
                        entering={FadeInDown.delay(200).springify()}
                        className="mx-4 mt-6"
                    >
                        <SkiaGlassPane
                            height={undefined}
                            cornerRadius={20}
                            backgroundColor="rgba(20, 20, 23, 0.6)"
                        >
                            <View className="p-6">
                                <View className="flex-row items-center justify-between mb-4">
                                    <Text className="text-text-secondary text-xs uppercase tracking-wider font-bold font-label">
                                        Distribución de Atributos
                                    </Text>
                                    <Text className="text-text-tertiary text-xs font-mono">
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
                                                        <Text className="text-text-primary font-bold text-sm font-label tracking-wide">
                                                            {attr.label}
                                                        </Text>
                                                    </View>
                                                    <Text className="text-text-secondary text-sm font-mono font-bold">
                                                        {count}
                                                    </Text>
                                                </View>
                                                <View className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
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
                            </View>
                        </SkiaGlassPane>
                    </Animated.View>

                    {/* Anti-Gravity Score */}
                    <Animated.View
                        entering={FadeInDown.delay(250).springify()}
                        className="mx-4 mt-6 mb-8"
                    >
                        <SkiaGlassPane
                            height={undefined}
                            cornerRadius={20}
                            backgroundColor="rgba(250, 204, 21, 0.05)"
                            borderColor="rgba(250, 204, 21, 0.3)"
                            borderWidth={0.5}
                            shadowColor="rgba(250, 204, 21, 0.1)"
                        >
                            <View className="p-6">
                                <View className="flex-row items-center justify-between mb-4">
                                    <Text className="text-text-secondary text-xs uppercase tracking-wider font-bold font-label">
                                        Puntuación Anti-Gravedad
                                    </Text>
                                    <IconSymbol name="arrow.up.circle.fill" size={24} color="#FACC15" />
                                </View>
                                <Text className="text-text-primary font-black text-6xl mb-2 font-display text-center" style={{ textShadowColor: '#FACC15', textShadowRadius: 10 }}>
                                    {Math.round(antiGravityScore)}
                                </Text>
                                <View className="h-3 bg-black/40 rounded-full overflow-hidden border border-white/10 mt-2">
                                    <View
                                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                                        style={{ width: `${antiGravityScore}%`, backgroundColor: '#FACC15' }}
                                    />
                                </View>
                                <Text className="text-text-tertiary text-sm mt-3 text-center font-label italic opacity-80">
                                    "Tu capacidad de elevarte sobre la gravedad del caos"
                                </Text>
                            </View>
                        </SkiaGlassPane>
                    </Animated.View>

                    <View className="h-24" />

                </ScrollView>
            </GradientBackground>
        </SafeAreaView>
    );
}
