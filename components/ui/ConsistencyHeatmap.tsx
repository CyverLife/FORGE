import { SkiaGlassPane } from '@/components/ui/SkiaGlassPane';
import React, { useMemo } from 'react';
import { Dimensions, Text, View } from 'react-native';

interface HeatmapProps {
    habits: any[]; // Using generalized habit type for now
    daysBack?: number;
}

interface CalendarDay {
    date: Date;
    level: number;
    ratio: number;
}

const { width } = Dimensions.get('window');
const GAP = 3;
const BOX_SIZE = (width - 60 - (13 * GAP)) / 14;

export const ConsistencyHeatmap = ({ habits, daysBack = 91 }: HeatmapProps) => {

    const calendarData = useMemo(() => {
        const today = new Date();
        const days: CalendarDay[] = [];

        // Generate last 91 days (approx 3 months)
        // We render columns of 7 (weeks). 91 days = 13 weeks.
        for (let i = 0; i < daysBack; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - ((daysBack - 1) - i)); // Order: Oldest -> Newest
            date.setHours(0, 0, 0, 0);

            // Calculate intensity
            let completed = 0;
            let total = 0;

            habits.forEach(h => {
                const existedAtDate = new Date(h.created_at || 0) <= date;
                if (!existedAtDate) return;

                total++;
                const isDone = h.logs?.some((l: any) => {
                    const lDate = new Date(l.completed_at);
                    lDate.setHours(0, 0, 0, 0);
                    return lDate.getTime() === date.getTime() && l.status === 'completed';
                });
                if (isDone) completed++;
            });

            // Intensity 0-4 scale
            const ratio = total > 0 ? completed / total : 0;
            let level = 0;
            if (ratio > 0.8) level = 4;
            else if (ratio > 0.5) level = 3;
            else if (ratio > 0.2) level = 2;
            else if (ratio > 0) level = 1;

            days.push({ date, level, ratio });
        }
        return days;
    }, [habits, daysBack]);

    // Group into weeks for layout (Vertical weeks, Horizontal scrolling flow)
    const weeks = useMemo(() => {
        const w: CalendarDay[][] = [];
        let currentWeek: CalendarDay[] = [];

        // Pad start if needed to align weekdays? 
        // For simplicity, just chunk by 7.
        calendarData.forEach((day, i) => {
            currentWeek.push(day);
            if (currentWeek.length === 7 || i === calendarData.length - 1) {
                w.push(currentWeek);
                currentWeek = [];
            }
        });
        return w;
    }, [calendarData]);

    const getColor = (level: number) => {
        switch (level) {
            case 4: return 'bg-orange-500 shadow-orange-500/50';
            case 3: return 'bg-orange-600/80';
            case 2: return 'bg-orange-800/60';
            case 1: return 'bg-white/10';
            default: return 'bg-white/5';
        }
    };

    return (
        <SkiaGlassPane height={undefined} cornerRadius={20} backgroundColor="rgba(20, 20, 23, 0.6)">
            <View className="p-5">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-white font-bold text-xs uppercase tracking-widest">
                        Consistencia (3 Meses)
                    </Text>
                    <Text className="text-gray-500 text-[10px]">
                        Más activo
                    </Text>
                </View>

                <View className="flex-row gap-[3px]">
                    {weeks.map((week, wIndex) => (
                        <View key={wIndex} className="gap-[3px]">
                            {week.map((day, dIndex) => (
                                <View
                                    key={dIndex}
                                    style={{ width: BOX_SIZE, height: BOX_SIZE }}
                                    className={`rounded-sm ${getColor(day.level)}`}
                                />
                            ))}
                        </View>
                    ))}
                </View>
            </View>
        </SkiaGlassPane>
    );
};
