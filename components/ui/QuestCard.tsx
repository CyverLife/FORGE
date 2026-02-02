import { PressableScale } from '@/components/ui/PressableScale';
import { SkiaGlassPane } from '@/components/ui/SkiaGlassPane';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Habit } from '@/types';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Reanimated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

interface QuestCardProps {
    habit: Habit;
    onComplete: () => void;
    onFail: () => void;
}

const AnimatedTouchableOpacity = Reanimated.createAnimatedComponent(TouchableOpacity);

export const QuestCard = ({ habit, onComplete, onFail }: QuestCardProps) => {
    // Animation State
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handleComplete = () => {
        // Haptic feedback for tactile response
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        scale.value = withSequence(
            withSpring(0.8),
            withSpring(1.2),
            withTiming(1, { duration: 150 })
        );
        // Delay callback slightly to show animation? Or just run it.
        // Let's run it immediately, the animation is visual feedback.
        setTimeout(() => onComplete(), 100);
    };

    // Determine visuals based on Attribute
    const getAttributeColor = (attr: string) => {
        switch (attr) {
            case 'IRON': return '#EF4444'; // Red
            case 'FIRE': return '#F97316'; // Orange
            case 'STEEL': return '#64748B'; // Slate
            case 'FOCUS': return '#3B82F6'; // Blue
            default: return '#A855F7'; // Purple
        }
    };

    // Determine visuals based on status (completed vs active)
    // Note: The prop passed down assumes 'active' for list, but let's style it ready for interaction.
    // For now we assume active state mainly.

    const color = getAttributeColor(habit.attribute);
    const isCompleted = false; // logic would be passed down if we were showing history, for now this is "Active Quest"

    return (
        <PressableScale scaleValue={0.97}>
            <View className="mb-4 mx-1">
                {/* Progress Bar Background (Behind card or top border?) -> Let's do a bottom accent line */}

                {/* Progress Bar Background (Behind card or top border?) -> Let's do a bottom accent line */}

                <SkiaGlassPane
                    style={{ borderRadius: 12 }}
                    cornerRadius={12}
                    blurAmount={25}
                    backgroundColor="rgba(0,0,0,0.5)"
                    shadowColor={`${color}40`}
                    borderColor={`${color}30`}
                >
                    <View className="flex-row items-center p-3">

                        {/* Left: Badge Icon */}
                        <View className="w-12 h-12 justify-center items-center bg-black/40 rounded-lg border border-white/5 mr-4">
                            <IconSymbol
                                name={habit.attribute === 'IRON' ? 'dumbbell.fill' :
                                    habit.attribute === 'FOCUS' ? 'brain.head.profile' : 'flame.fill'}
                                size={20}
                                color={color}
                            />
                        </View>

                        {/* Middle: Protocol Details */}
                        <View className="flex-1 opacity={habit.completed_today ? 0.5 : 1}">
                            <View className="flex-row items-center mb-1">
                                <Text className={`font-black text-base uppercase tracking-tight mr-2 font-mono ${habit.completed_today ? 'text-emerald-400 line-through' : 'text-white'}`} style={{ textShadowColor: color, textShadowRadius: 8 }}>
                                    {habit.title}
                                </Text>
                                {habit.alignment === 'CORE' && (
                                    <View className="bg-amber-500/10 px-1.5 py-0.5 border border-amber-500/50 rounded-sm">
                                        <Text className="text-amber-500 text-[8px] font-black uppercase">CORE</Text>
                                    </View>
                                )}
                            </View>

                            {/* Subtitle / Progress Text */}
                            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest font-mono">
                                {habit.completed_today ? 'MISION COMPLETADA' : `${habit.streak} HEAT • +${habit.xp_reward || 50} SPK`}
                            </Text>

                            {/* Tiny Progress Bar */}
                            <View className="h-1 bg-black/50 w-full mt-2 overflow-hidden rounded-full">
                                <View style={{ width: `${Math.min(habit.streak * 10, 100)}%`, backgroundColor: habit.completed_today ? '#10B981' : color }} className="h-full" />
                            </View>
                        </View>

                        {/* Right: Checkbox Action */}
                        <AnimatedTouchableOpacity
                            className={`ml-3 w-12 h-12 rounded-lg border-2 items-center justify-center ${habit.completed_today ? 'bg-emerald-900/40 border-emerald-500/50' : 'bg-black/40 border-[#F97316]/50 active:bg-[#F97316]'}`}
                            style={animatedStyle}
                            onPress={habit.completed_today ? undefined : handleComplete}
                            disabled={habit.completed_today}
                        >
                            <IconSymbol name="checkmark" size={24} color={habit.completed_today ? '#10B981' : '#F97316'} />
                        </AnimatedTouchableOpacity>
                    </View>
                </SkiaGlassPane>
            </View>
        </PressableScale>
    );
};
