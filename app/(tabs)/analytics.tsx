import { AchievementShelf } from '@/components/ui/AchievementShelf';
import { AttributeRadar } from '@/components/ui/AttributeRadar';
import { ConsistencyHeatmap } from '@/components/ui/ConsistencyHeatmap';
import { GhostMode } from '@/components/ui/GhostMode';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LevelProjection } from '@/components/ui/LevelProjection';
import { RingProgress } from '@/components/ui/RingProgress';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SkiaGlassPane } from '@/components/ui/SkiaGlassPane';
import { useGamification } from '@/hooks/useGamification';
import { useHabits } from '@/hooks/useHabits';
import { calculateNextLevelXp } from '@/lib/gamification';
import React, { useMemo, useState } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Helper to get day name
const getDayName = (date: Date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[date.getDay()];
};

type TabOption = 'Rendimiento' | 'Maestría' | 'Legado';

export default function AnalyticsScreen() {
    const { habits } = useHabits();
    const { antiGravityScore, consciousnessRank, streak: globalStreak, xp, level, angelScore } = useGamification();
    const [activeTab, setActiveTab] = useState<TabOption>('Rendimiento');

    // 1. Weekly Data & Accuracy
    const weeklyStats = useMemo(() => {
        const data = [];
        const today = new Date();
        let totalCompletedWeek = 0;
        let totalPossibleWeek = 0;

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            let count = 0;
            const habitCount = habits.length;

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

            const dailyAccuracy = habitCount > 0 ? count / habitCount : 0;
            totalCompletedWeek += count;
            totalPossibleWeek += habitCount;

            data.push({
                day: getDayName(date),
                count,
                accuracy: dailyAccuracy,
                date,
                full: count >= habitCount && habitCount > 0
            });
        }

        const accuracy = totalPossibleWeek > 0 ? totalCompletedWeek / totalPossibleWeek : 0;
        return { daily: data, accuracy, totalCompletedWeek };
    }, [habits]);

    // 2. Insights
    const insights = useMemo(() => {
        if (!habits.length) return { best: null, worst: null };
        const sortedByStreak = [...habits].sort((a, b) => (b.streak || 0) - (a.streak || 0));
        const best = sortedByStreak[0]?.streak > 0 ? sortedByStreak[0] : null;

        const sortedByFailures = [...habits].sort((a, b) => {
            const failsA = a.logs?.filter((l: any) => l.status === 'failed').length || 0;
            const failsB = b.logs?.filter((l: any) => l.status === 'failed').length || 0;
            return failsB - failsA;
        });
        const worst = sortedByFailures[0]?.logs?.some((l: any) => l.status === 'failed') ? sortedByFailures[0] : null;

        return { best, worst };
    }, [habits]);

    // Total Completions (All Time)
    const totalCompletions = useMemo(() => {
        return habits.reduce((acc, h) => acc + (h.logs?.filter((l: any) => l.status === 'completed').length || 0), 0);
    }, [habits]);

    // 3. Derived RPG Attributes
    const attributeStats = useMemo(() => {
        const iron = Math.min(totalCompletions * 2, 100);
        const fire = Math.min(globalStreak * 5, 100);
        const steel = Math.round(weeklyStats.accuracy * 100);
        const bestHabitStreak = insights.best?.streak || 0;
        const focus = Math.min(bestHabitStreak * 4, 100);
        return { iron, fire, steel, focus };
    }, [totalCompletions, globalStreak, weeklyStats.accuracy, insights.best]);

    // 4. Level Projection
    const nextLevelXp = useMemo(() => calculateNextLevelXp(level || 1), [level]);

    return (
        <SafeAreaView className="flex-1 bg-deep-black">
            <GradientBackground>
                <View className="flex-1 px-4">

                    {/* Header Fixed */}
                    <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-6 mt-4">
                        <View className="flex-row items-center gap-3 mb-1">
                            <IconSymbol name="chart.bar.fill" size={24} color="#F97316" />
                            <Text className="text-white font-black text-2xl uppercase font-display tracking-wider">
                                Rendimiento
                            </Text>
                        </View>
                        <Text className="text-text-secondary text-sm font-label uppercase tracking-widest text-opacity-70 ml-1">
                            Analítica del Sistema
                        </Text>
                    </Animated.View>

                    {/* Tabs */}
                    <Animated.View entering={FadeInDown.delay(200).springify()}>
                        <SegmentedControl
                            options={['Rendimiento', 'Maestría', 'Legado']}
                            selectedOption={activeTab}
                            onOptionPress={(opt) => setActiveTab(opt as TabOption)}
                        />
                    </Animated.View>

                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                        {/* TAB CONTENT: RENDIMIENTO */}
                        {activeTab === 'Rendimiento' && (
                            <Animated.View entering={FadeIn.duration(400)} exiting={FadeOut.duration(200)}>
                                {/* GHOST MODE - Already animated internally (delay 50) */}
                                <GhostMode habits={habits} />

                                {/* TOP ROW: ACCURACY + STATS */}
                                <View className="flex-row gap-4 mb-8">
                                    <Animated.View entering={FadeInDown.delay(150).springify()} className="flex-1">
                                        <SkiaGlassPane height={220} cornerRadius={24} backgroundColor="rgba(20, 20, 23, 0.6)">
                                            <View className="flex-1 items-center justify-between p-6">
                                                <Text className="text-text-secondary text-[10px] uppercase font-bold tracking-widest text-center">Precisión Semanal</Text>
                                                <View className="flex-1 justify-center items-center">
                                                    <RingProgress
                                                        progress={weeklyStats.accuracy}
                                                        radius={60}
                                                        strokeWidth={12}
                                                        label={`${Math.round(weeklyStats.accuracy * 100)}%`}
                                                        subLabel="Focus"
                                                    />
                                                </View>
                                            </View>
                                        </SkiaGlassPane>
                                    </Animated.View>

                                    <View className="flex-1 gap-4">
                                        <Animated.View entering={FadeInDown.delay(250).springify()} className="flex-1">
                                            <SkiaGlassPane height={undefined} cornerRadius={24} backgroundColor="rgba(249, 115, 22, 0.15)" borderColor="rgba(249, 115, 22, 0.3)">
                                                <View className="flex-1 p-5 justify-center">
                                                    <IconSymbol name="flame.fill" size={22} color="#F97316" />
                                                    <Text className="text-white font-black text-3xl font-display leading-tight mt-2">{globalStreak}</Text>
                                                    <Text className="text-orange-300 text-[9px] uppercase font-bold tracking-widest mt-1">Racha Global</Text>
                                                </View>
                                            </SkiaGlassPane>
                                        </Animated.View>

                                        <Animated.View entering={FadeInDown.delay(350).springify()} className="flex-1">
                                            <SkiaGlassPane height={undefined} cornerRadius={24} backgroundColor="rgba(20, 20, 23, 0.6)">
                                                <View className="flex-1 p-5 justify-center">
                                                    <IconSymbol name="checkmark.circle.fill" size={22} color="#10B981" />
                                                    <Text className="text-white font-black text-3xl font-display leading-tight mt-2">{totalCompletions}</Text>
                                                    <Text className="text-text-secondary text-[9px] uppercase font-bold tracking-widest mt-1">Total Logs</Text>
                                                </View>
                                            </SkiaGlassPane>
                                        </Animated.View>
                                    </View>
                                </View>

                                {/* WEEKLY PATTERNS small */}
                                <Animated.View entering={FadeInDown.delay(450).springify()} className="mb-4">
                                    <SkiaGlassPane height={undefined} cornerRadius={24} backgroundColor="rgba(10, 10, 10, 0.4)">
                                        <View className="p-5">
                                            <Text className="text-white font-bold text-sm tracking-wide mb-4">Patrones (7 Días)</Text>
                                            <View className="gap-3">
                                                {weeklyStats.daily.map((stat, i) => (
                                                    <View key={i} className="flex-row items-center gap-3">
                                                        <Text className="text-gray-400 text-[10px] font-bold w-8 text-right uppercase">{stat.day}</Text>
                                                        <View className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                                                            <View style={{ width: `${stat.accuracy * 100}%` }} className={`h-full rounded-full ${stat.full ? 'bg-orange-500' : 'bg-blue-500/60'}`} />
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    </SkiaGlassPane>
                                </Animated.View>
                            </Animated.View>
                        )}

                        {/* TAB CONTENT: MAESTRÍA */}
                        {activeTab === 'Maestría' && (
                            <Animated.View entering={FadeIn.duration(400)} exiting={FadeOut.duration(200)}>
                                <Animated.View entering={FadeInDown.delay(100).springify()}>
                                    <LevelProjection currentXp={Math.round(xp || 0)} nextLevelXp={nextLevelXp} avgDailyXp={35} />
                                </Animated.View>

                                <Animated.View entering={FadeInDown.delay(200).springify()} className="mb-8 items-center mt-4">
                                    <SkiaGlassPane height={undefined} width={width - 32} cornerRadius={24} backgroundColor="rgba(20, 20, 23, 0.4)">
                                        <View className="p-6 items-center">
                                            <Text className="text-orange-500 font-black text-sm uppercase tracking-widest mb-4 font-display">Arquetipo</Text>
                                            <AttributeRadar stats={attributeStats} size={240} />
                                        </View>
                                    </SkiaGlassPane>
                                </Animated.View>

                                <Animated.View entering={FadeInDown.delay(300).springify()}>
                                    <ConsistencyHeatmap habits={habits} />
                                </Animated.View>
                            </Animated.View>
                        )}

                        {/* TAB CONTENT: LEGADO */}
                        {activeTab === 'Legado' && (
                            <Animated.View entering={FadeIn.duration(400)} exiting={FadeOut.duration(200)}>
                                <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-8">
                                    <SkiaGlassPane height={undefined} cornerRadius={20} backgroundColor="rgba(20, 20, 23, 0.8)">
                                        <View className="p-4 flex-row justify-between items-center">
                                            <View className="flex-row items-center gap-3">
                                                <View className="w-10 h-10 rounded-full bg-yellow-500/20 items-center justify-center border border-yellow-500/50">
                                                    <IconSymbol name="trophy.fill" size={18} color="#EAB308" />
                                                </View>
                                                <View>
                                                    <Text className="text-white font-bold text-base">{consciousnessRank}</Text>
                                                    <Text className="text-text-secondary text-[10px] uppercase font-bold tracking-widest">Rango</Text>
                                                </View>
                                            </View>
                                            <Text className="text-yellow-400 font-black text-2xl font-display">{Math.round(antiGravityScore)}</Text>
                                        </View>
                                    </SkiaGlassPane>
                                </Animated.View>

                                <Animated.View entering={FadeInDown.delay(200).springify()}>
                                    <AchievementShelf stats={{
                                        totalCompletions,
                                        streak: globalStreak,
                                        level: level || 1,
                                        accuracy: weeklyStats.accuracy,
                                        angelScore: angelScore || 0
                                    }} />
                                </Animated.View>

                                {/* Empty space filler */}
                                <Animated.View entering={FadeInDown.delay(300).springify()} className="h-48 pt-10 items-center justify-center opacity-30">
                                    <IconSymbol name="star.circle" size={40} color="#555" />
                                    <Text className="text-white text-xs mt-2 uppercase font-bold">Más logros pronto...</Text>
                                </Animated.View>
                            </Animated.View>
                        )}

                        <View className="h-24" />
                    </ScrollView>
                </View>
            </GradientBackground>
        </SafeAreaView>
    );
}
