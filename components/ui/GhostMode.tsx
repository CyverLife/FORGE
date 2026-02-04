import { IconSymbol } from '@/components/ui/icon-symbol';
import { SkiaGlassPane } from '@/components/ui/SkiaGlassPane';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface GhostModeProps {
    habits: any[]; // Generalized for now
}

export const GhostMode = ({ habits }: GhostModeProps) => {

    const stats = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);

        const endOfYesterdaySameTime = new Date(startOfYesterday);
        // Compare exactly up to "Now" time but yesterday?? 
        // Or just compare Total Yesterday vs Total Today so far?
        // "Ghost Mode" usually implies pace. Let's compare "Total Today So Far" vs "Total Yesterday By This Time".
        endOfYesterdaySameTime.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

        let countToday = 0;
        let countGhost = 0; // Yesterday at same time

        habits.forEach(h => {
            h.logs?.forEach((l: any) => {
                if (l.status !== 'completed') return;
                const logDate = new Date(l.completed_at);

                if (logDate >= startOfToday && logDate <= now) {
                    countToday++;
                } else if (logDate >= startOfYesterday && logDate <= endOfYesterdaySameTime) {
                    countGhost++;
                }
            });
        });

        const diff = countToday - countGhost;
        const status = diff > 0 ? 'WINNING' : diff < 0 ? 'LOSING' : 'DRAW';

        return { countToday, countGhost, diff, status };
    }, [habits]);

    const maxVal = Math.max(stats.countToday, stats.countGhost, 10); // Scale

    return (
        <Animated.View entering={FadeInDown.delay(50).springify()} className="mb-6">
            <SkiaGlassPane height={undefined} cornerRadius={20} backgroundColor="rgba(20, 20, 23, 0.4)" borderColor="rgba(255, 255, 255, 0.1)">
                <View className="p-5">
                    <View className="flex-row justify-between items-center mb-4">
                        <View className="flex-row items-center gap-2">
                            <IconSymbol name="timer" size={16} color="#A1A1AA" />
                            <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                                Modo Fantasma
                            </Text>
                        </View>
                        <Text className={`font-bold text-xs ${stats.diff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {stats.diff > 0 ? '+' : ''}{stats.diff} vs Ayer
                        </Text>
                    </View>

                    {/* Bars Container */}
                    <View className="gap-3">
                        {/* YOU (TODAY) */}
                        <View>
                            <View className="flex-row justify-between mb-1">
                                <Text className="text-white font-bold text-[10px] uppercase">Tú (Hoy)</Text>
                                <Text className="text-white font-bold text-[10px]">{stats.countToday}</Text>
                            </View>
                            <View className="h-3 bg-white/5 rounded-full overflow-hidden">
                                <View
                                    style={{ width: `${(stats.countToday / maxVal) * 100}%` }}
                                    className="h-full bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                                />
                            </View>
                        </View>

                        {/* GHOST (YESTERDAY) */}
                        <View className="opacity-50">
                            <View className="flex-row justify-between mb-1">
                                <Text className="text-white font-bold text-[10px] uppercase">Fantasma (Ayer)</Text>
                                <Text className="text-white font-bold text-[10px]">{stats.countGhost}</Text>
                            </View>
                            <View className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                <View
                                    style={{ width: `${(stats.countGhost / maxVal) * 100}%` }}
                                    className="h-full bg-blue-400 rounded-full"
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </SkiaGlassPane>
        </Animated.View>
    );
};
