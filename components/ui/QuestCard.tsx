import { IconSymbol } from '@/components/ui/icon-symbol';
import { Habit } from '@/types';
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
        <View className="mb-4 mx-1">
            {/* Progress Bar Background (Behind card or top border?) -> Let's do a bottom accent line */}

            <View className="bg-[#1A1110] p-1 rounded-sm border border-[#2A2A2E] shadow-sm shadow-orange-900/10">
                <View className="flex-row items-center p-3">

                    {/* Left: Badge Icon */}
                    <View className="w-12 h-12 justify-center items-center bg-[#0F0505] rounded-sm border border-white/5 mr-4">
                        <IconSymbol
                            name={habit.attribute === 'IRON' ? 'dumbbell.fill' :
                                habit.attribute === 'FOCUS' ? 'brain.head.profile' : 'flame.fill'}
                            size={20}
                            color={color}
                        />
                    </View>

                    {/* Middle: Protocol Details */}
                    <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                            <Text className="text-white font-black text-base uppercase tracking-tight mr-2 font-mono">
                                {habit.title}
                            </Text>
                            {habit.alignment === 'CORE' && (
                                <View className="bg-amber-500/10 px-1.5 py-0.5 border border-amber-500/50">
                                    <Text className="text-amber-500 text-[8px] font-black uppercase">CORE</Text>
                                </View>
                            )}
                        </View>

                        {/* Subtitle / Progress Text */}
                        <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest font-mono">
                            {habit.streak} HEAT • +{habit.xp_reward || 50} SPK
                        </Text>

                        {/* Tiny Progress Bar */}
                        <View className="h-1 bg-black/50 w-full mt-2 overflow-hidden">
                            <View style={{ width: `${Math.min(habit.streak * 10, 100)}%`, backgroundColor: color }} className="h-full" />
                        </View>
                    </View>

                    {/* Right: Checkbox Action */}
                    <AnimatedTouchableOpacity
                        className="ml-3 w-12 h-12 bg-[#0F0505] rounded-sm border-2 border-[#F97316] items-center justify-center active:bg-[#F97316]"
                        style={animatedStyle}
                        onPress={handleComplete}
                    >
                        <IconSymbol name="checkmark" size={24} color="#F97316" />
                    </AnimatedTouchableOpacity>
                </View>
            </View>
        </View>
    );
};
