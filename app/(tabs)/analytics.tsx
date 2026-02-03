import { GradientBackground } from '@/components/ui/GradientBackground';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SkiaGlassPane } from '@/components/ui/SkiaGlassPane';
import { useGamification } from '@/hooks/useGamification';
import { useHabits } from '@/hooks/useHabits';
import React, { useMemo } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Helper to get day name
const getDayName = (date: Date) => {
    const days = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
    return days[date.getDay()];
};

export default function AnalyticsScreen() {
    const { habits } = useHabits();
    const { antiGravityScore, consciousnessRank } = useGamification();

    // 1. Weekly Activity Data
    const weeklyData = useMemo(() => {
        const data = [];
        const today = new Date();

        // Loop last 7 days (reverse)
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            // Count completed logs for this day across ALL habits
            let count = 0;
            habits.forEach(h => {
                if (h.logs) {
                    const hasLog = h.logs.some((l: any) => {
                        const logDate = new Date(l.completed_at);
                        logDate.setHours(0, 0, 0, 0);
                        return logDate.getTime() === date.getTime() && l.status === 'completed';
                    });
                    if (hasLog) count++;
                }
            });

            data.push({
                day: getDayName(date),
                count,
                date,
                full: count >= habits.length && habits.length > 0 // Perfect day?
            });
        }
        return data;
    }, [habits]);

    // 2. Habit Insights (Master & Weak Link)
    const insights = useMemo(() => {
        if (!habits.length) return { best: null, worst: null };

        // Best: Highest Streak
        const sortedByStreak = [...habits].sort((a, b) => (b.streak || 0) - (a.streak || 0));
        const best = sortedByStreak[0]?.streak > 0 ? sortedByStreak[0] : null;

        // Worst: Most 'failed' status logs relative to total attempts, OR zero streak with oldest creation
        // Simple approach: Lowest consistency (if available) or just 0 streak ?
        // Let's go with: Habit with most explicit 'failed' logs
        const sortedByFailures = [...habits].sort((a, b) => {
            const failsA = a.logs?.filter((l: any) => l.status === 'failed').length || 0;
            const failsB = b.logs?.filter((l: any) => l.status === 'failed').length || 0;
            return failsB - failsA;
        });

        const worst = sortedByFailures[0]?.logs?.some((l: any) => l.status === 'failed') ? sortedByFailures[0] : null;

        return { best, worst };
    }, [habits]);

    // Max value for chart scaling
    const maxDaily = Math.max(...weeklyData.map(d => d.count), 1);

    // Attribute Stats
    const attributeStats = useMemo(() => {
        return {
            FIRE: habits.filter(h => h.attribute === 'FIRE').length,
            IRON: habits.filter(h => h.attribute === 'IRON').length,
            STEEL: habits.filter(h => h.attribute === 'STEEL').length,
            FOCUS: habits.filter(h => h.attribute === 'FOCUS').length,
        };
    }, [habits]);


    return (
        <SafeAreaView className="flex-1 bg-deep-black">
            <GradientBackground>
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                    {/* Header */}
                    <Animated.View entering={FadeInDown.delay(0).springify()} className="pt-12 pb-6 px-4 border-b border-border-subtle">
                        <View className="flex-row items-center gap-3 mb-2">
                            <IconSymbol name="chart.pie.fill" size={28} color="#F97316" />
                            <Text className="text-text-primary font-black text-3xl uppercase tracking-wider font-display">
                                ANALÍTICA
                            </Text>
                        </View>
                        <Text className="text-text-secondary text-sm">
                            Profundidad del sistema
                        </Text>
                    </Animated.View>

                    {/* 1. WEEKLY CHART */}
                    <Animated.View entering={FadeInDown.delay(100).springify()} className="mx-4 mt-6">
                        <SkiaGlassPane height={undefined} cornerRadius={20} backgroundColor="rgba(20, 20, 23, 0.6)">
                            <View className="p-6">
                                <View className="flex-row items-center justify-between mb-6">
                                    <Text className="text-text-secondary text-xs uppercase tracking-wider font-bold font-label">
                                        Rendimiento Semanal
                                    </Text>
                                    <Text className="text-forge-orange font-bold text-xs">{weeklyData.reduce((acc, curr) => acc + curr.count, 0)} Completados</Text>
                                </View>

                                <View className="flex-row items-end justify-between h-32 px-2">
                                    {weeklyData.map((d, i) => (
                                        <View key={i} className="items-center gap-2" style={{ width: (width - 80) / 7 }}>
                                            {/* Bar */}
                                            <View className="w-full bg-white/5 rounded-t-sm relative overflow-hidden"
                                                style={{ height: '100%' }}>
                                                <View
                                                    className={`absolute bottom-0 w-full rounded-t-sm ${d.full ? 'bg-forge-orange' : 'bg-white/20'}`}
                                                    style={{ height: `${(d.count / maxDaily) * 100}%` }}
                                                />
                                            </View>
                                            {/* Label */}
                                            <Text className={`text-[10px] font-bold ${d.date.getDay() === new Date().getDay() ? 'text-white' : 'text-white/30'}`}>
                                                {d.day}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </SkiaGlassPane>
                    </Animated.View>

                    {/* 2. INSIGHTS ROW */}
                    <View className="flex-row gap-4 mx-4 mt-6">
                        {/* Master Component */}
                        <Animated.View entering={FadeInDown.delay(200).springify()} className="flex-1">
                            <SkiaGlassPane height={160} cornerRadius={16} backgroundColor="rgba(16, 185, 129, 0.1)" borderColor="rgba(16, 185, 129, 0.2)">
                                <View className="p-4 flex-1 justify-between">
                                    <View>
                                        <IconSymbol name="crown.fill" size={24} color="#10B981" />
                                        <Text className="text-emerald-400 font-bold text-[10px] uppercase mt-2 tracking-wider">PROTOCOLO MAESTRO</Text>
                                    </View>
                                    <View>
                                        <Text className="text-white font-black text-lg leading-6 mb-1" numberOfLines={2}>
                                            {insights.best?.title || "Sin datos"}
                                        </Text>
                                        <Text className="text-white/50 text-xs font-mono">
                                            Racha: {insights.best?.streak || 0}
                                        </Text>
                                    </View>
                                </View>
                            </SkiaGlassPane>
                        </Animated.View>

                        {/* Weak Link Component */}
                        <Animated.View entering={FadeInDown.delay(250).springify()} className="flex-1">
                            <SkiaGlassPane height={160} cornerRadius={16} backgroundColor="rgba(239, 68, 68, 0.1)" borderColor="rgba(239, 68, 68, 0.2)">
                                <View className="p-4 flex-1 justify-between">
                                    <View>
                                        <IconSymbol name="exclamationmark.triangle.fill" size={24} color="#EF4444" />
                                        <Text className="text-red-400 font-bold text-[10px] uppercase mt-2 tracking-wider">ESLABÓN DÉBIL</Text>
                                    </View>
                                    <View>
                                        <Text className="text-white font-black text-lg leading-6 mb-1" numberOfLines={2}>
                                            {insights.worst?.title || "Impecable"}
                                        </Text>
                                        <Text className="text-white/50 text-xs font-mono">
                                            {insights.worst ? "Requiere atención" : "Sin fallas críticas"}
                                        </Text>
                                    </View>
                                </View>
                            </SkiaGlassPane>
                        </Animated.View>
                    </View>

                    {/* 3. RANK & ANTIGRAVITY (Compact) */}
                    <Animated.View entering={FadeInDown.delay(300).springify()} className="mx-4 mt-6">
                        <SkiaGlassPane height={undefined} cornerRadius={20} backgroundColor="rgba(20, 20, 23, 0.6)">
                            <View className="p-6 flex-row items-center justify-between">
                                <View>
                                    <Text className="text-text-secondary text-xs uppercase font-bold font-label mb-1">Rango Actual</Text>
                                    <Text className="text-white font-black text-2xl font-display">{consciousnessRank}</Text>
                                </View>
                                <View className="h-10 w-px bg-white/10" />
                                <View className="items-end">
                                    <Text className="text-text-secondary text-xs uppercase font-bold font-label mb-1">Puntuación A.G.</Text>
                                    <Text className="text-yellow-400 font-black text-2xl font-display">{Math.round(antiGravityScore)}</Text>
                                </View>
                            </View>
                        </SkiaGlassPane>
                    </Animated.View>

                    {/* 4. ATTRIBUTES (Simple Bars) */}
                    <Animated.View entering={FadeInDown.delay(350).springify()} className="mx-4 mt-6 mb-8">
                        <SkiaGlassPane height={undefined} cornerRadius={20} backgroundColor="rgba(20, 20, 23, 0.6)">
                            <View className="p-5 gap-4">
                                <Text className="text-text-secondary text-xs uppercase font-bold font-label">Balance de Elementos</Text>
                                {[
                                    { key: 'FIRE', label: 'FUEGO', color: '#EF4444' },
                                    { key: 'IRON', label: 'HIERRO', color: '#6B7280' },
                                    { key: 'STEEL', label: 'ACERO', color: '#9CA3AF' },
                                    { key: 'FOCUS', label: 'FOCO', color: '#3B82F6' },
                                ].map(attr => (
                                    <View key={attr.key} className="flex-row items-center gap-3">
                                        <Text className="text-white/60 font-bold text-[10px] w-12">{attr.label}</Text>
                                        <View className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                            <View className="h-full rounded-full"
                                                style={{
                                                    backgroundColor: attr.color,
                                                    width: `${habits.length ? (attributeStats[attr.key as keyof typeof attributeStats] / habits.length) * 100 : 0}%`
                                                }}
                                            />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </SkiaGlassPane>
                    </Animated.View>

                    <View className="h-24" />
                </ScrollView>
            </GradientBackground>
        </SafeAreaView>
    );
}
