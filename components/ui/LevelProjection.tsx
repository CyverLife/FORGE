import { IconSymbol } from '@/components/ui/icon-symbol';
import { SkiaGlassPane } from '@/components/ui/SkiaGlassPane';
import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface LevelProjectionProps {
    currentXp: number;
    nextLevelXp: number;
    avgDailyXp?: number;
}

export const LevelProjection = ({ currentXp, nextLevelXp, avgDailyXp = 25 }: LevelProjectionProps) => {
    const remainingXp = Math.max(0, nextLevelXp - currentXp);
    const daysToLevel = avgDailyXp > 0 ? Math.ceil(remainingXp / avgDailyXp) : 99;
    const progress = Math.min(1, currentXp / nextLevelXp);

    return (
        <Animated.View entering={FadeInDown.delay(450).springify()} className="mb-4">
            <SkiaGlassPane height={undefined} cornerRadius={20} backgroundColor="rgba(30, 30, 35, 0.6)" borderColor="rgba(255,255,255,0.1)">
                <View className="p-5">
                    <View className="flex-row justify-between items-center mb-3">
                        <View className="flex-row items-center gap-2">
                            <IconSymbol name="hourglass" size={16} color="#A1A1AA" />
                            <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                                Proyección
                            </Text>
                        </View>
                        <Text className="text-white font-bold text-xs">
                            Nivel {(Math.floor(Math.sqrt(currentXp / 100)) + 2)} en <Text className="text-orange-400">{daysToLevel} días</Text>
                        </Text>
                    </View>

                    {/* Progress Bar */}
                    <View className="h-4 bg-black/40 rounded-full overflow-hidden border border-white/5 relative justify-center">
                        {/* Fill */}
                        <View
                            style={{ width: `${progress * 100}%` }}
                            className="h-full bg-orange-500 rounded-full absolute shadow-[0_0_15px_rgba(249,115,22,0.6)]"
                        />
                        {/* Text Overlay */}
                        <Text className="text-[9px] font-bold text-white/80 absolute w-full text-center z-10 shadow-black">
                            {currentXp} / {nextLevelXp} XP
                        </Text>
                    </View>

                    <Text className="text-gray-500 text-[10px] mt-2 text-right">
                        Basado en ~{avgDailyXp} XP / día
                    </Text>
                </View>
            </SkiaGlassPane>
        </Animated.View>
    );
};
