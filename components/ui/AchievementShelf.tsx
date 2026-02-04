import { IconSymbol } from '@/components/ui/icon-symbol';
import { SkiaGlassPane } from '@/components/ui/SkiaGlassPane';
import { useAchievements } from '@/hooks/useAchievements';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

interface AchievementShelfProps {
    stats: {
        totalCompletions: number;
        streak: number;
        level: number;
        accuracy: number;
        angelScore: number;
    };
}

export const AchievementShelf = ({ stats }: AchievementShelfProps) => {
    const { achievements, unlockedCount } = useAchievements(stats);

    return (
        <View className="mb-8">
            <View className="flex-row justify-between items-end mb-4 px-2">
                <Text className="text-white font-black text-lg uppercase font-display tracking-wider">
                    Trofeos
                </Text>
                <Text className="text-orange-400 font-bold text-xs uppercase tracking-widest">
                    {unlockedCount} / {achievements.length} Desbloqueados
                </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 0, gap: 12 }}>
                {achievements.map((a) => (
                    <View key={a.id} className="w-32">
                        <SkiaGlassPane
                            height={160}
                            cornerRadius={16}
                            backgroundColor={a.unlocked ? "rgba(249, 115, 22, 0.1)" : "rgba(255, 255, 255, 0.03)"}
                            borderColor={a.unlocked ? "rgba(249, 115, 22, 0.4)" : "rgba(255, 255, 255, 0.05)"}
                        >
                            <View className="flex-1 items-center justify-center p-4 gap-3">
                                <View className={`w-12 h-12 rounded-full items-center justify-center ${a.unlocked ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50' : 'bg-gray-800'}`}>
                                    <IconSymbol
                                        name={a.icon as any}
                                        size={24}
                                        color={a.unlocked ? "#FFF" : "#555"}
                                    />
                                </View>

                                <View className="items-center">
                                    <Text className={`text-center font-bold text-xs mb-1 ${a.unlocked ? 'text-white' : 'text-gray-600'}`}>
                                        {a.title}
                                    </Text>
                                    <Text className="text-gray-500 text-[9px] text-center leading-3">
                                        {a.description}
                                    </Text>
                                </View>
                            </View>
                        </SkiaGlassPane>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};
