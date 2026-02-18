import { IconSymbol } from '@/components/ui/icon-symbol';
import { LIQUID_SPRING } from '@/lib/motion';
import { Habit } from '@/types';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import Animated, {
    interpolate,
    interpolateColor,
    runOnJS,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

interface IgnitionStrikeCardProps {
    habit: Habit;
    onComplete: () => void;
    onFail?: () => void;
}

const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 1) return 'SPARK';
    if (difficulty <= 2) return 'EMBER';
    if (difficulty <= 3) return 'FLAME';
    if (difficulty <= 4) return 'BLAZE';
    return 'INFERNO';
};

const AnimatedIcon = Animated.createAnimatedComponent(IconSymbol);

export const IgnitionStrikeCard = ({ habit, onComplete, isEditing, onDelete }: IgnitionStrikeCardProps & { isEditing?: boolean; onDelete?: () => void }) => {
    const pressed = useSharedValue(false);
    const progress = useSharedValue(0);
    const successPop = useSharedValue(1);

    const triggerSuccess = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Completion Pop Sequence
        successPop.value = withSequence(
            withSpring(1.05, { damping: 10, stiffness: 200 }),
            withSpring(1, LIQUID_SPRING)
        );
        if (onComplete) onComplete();
    };

    const tap = Gesture.Tap()
        .onBegin(() => {
            pressed.value = true;
        })
        .onFinalize(() => {
            pressed.value = false;
            if (isEditing && onDelete) {
                runOnJS(onDelete)();
            } else if (!habit.completed_today) {
                // Feedback for user who taps instead of holds (only if NOT editing)
                runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Error);
            }
        });

    const longPress = Gesture.LongPress()
        .minDuration(500) // Faster ignition
        .onStart(() => {
            if (isEditing || habit.completed_today) return; // Lock if completed
            pressed.value = true;
            progress.value = withTiming(1, { duration: 500 }, (finished) => {
                if (finished) {
                    runOnJS(triggerSuccess)();
                }
            });
        })
        .onFinalize(() => {
            if (isEditing || habit.completed_today) return;
            if (progress.value < 1) {
                pressed.value = false;
                progress.value = withTiming(0, { duration: 200 });
            }
        });

    const gesture = Gesture.Simultaneous(tap, longPress);

    const containerStyle = useAnimatedStyle(() => {
        const baseScale = withSpring(pressed.value ? 0.96 : 1, LIQUID_SPRING);
        const borderColor = interpolateColor(
            progress.value,
            [0, 1],
            ['rgba(255,255,255,0.05)', '#22c55e'] // GREEN for success
        );

        return {
            transform: [{ scale: baseScale * successPop.value }],
            borderColor: isEditing ? '#EF4444' : (habit.completed_today ? '#22c55e' : borderColor),
            backgroundColor: habit.completed_today ? 'rgba(20, 40, 20, 0.6)' : '#131313' // Avoid undefined to ensure it's not transparent
        };
    });

    const heatGradientStyle = useAnimatedStyle(() => ({
        opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0.3, 0.8]),
    }));

    const fillStyle = useAnimatedStyle(() => ({
        width: `${progress.value * 100}%`,
        opacity: progress.value,
        backgroundColor: '#22c55e' // Green fill
    }));

    const holdToCompleteStyle = useAnimatedStyle(() => ({
        opacity: pressed.value ? 1 : 0
    }));

    const animatedIconProps = useAnimatedProps(() => ({
        color: pressed.value ? "#22c55e" : "#333"
    }));

    // STATIC FALLBACK MODE - NO ANIMATIONS
    return (
        <View style={{
            width: '100%',
            marginBottom: 12,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: habit.completed_today ? '#22c55e' : 'rgba(255,255,255,0.1)',
            backgroundColor: habit.completed_today ? 'rgba(20, 40, 20, 0.6)' : '#131313',
            overflow: 'hidden',
            padding: 0
        }}>

            {/* Heat Gradient Overlay (Static for now) */}
            <View style={StyleSheet.absoluteFill}>
                <LinearGradient
                    colors={['transparent', 'rgba(34, 197, 94, 0.1)']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                />
            </View>

            <TouchableOpacity
                onPress={onComplete}
                activeOpacity={0.7}
                disabled={habit.completed_today && !isEditing}
            >
                <View className="p-4 flex-row items-center justify-between z-10">
                    <View className="flex-1">
                        <Text className={`text-lg font-display ${habit.completed_today ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                            {habit.title}
                        </Text>
                        <Text className="text-xs text-text-tertiary font-mono uppercase tracking-widest mt-1">
                            {habit.attribute} • {getDifficultyLabel(habit.difficulty)}
                        </Text>
                    </View>

                    <View className={`w-10 h-10 rounded-full border items-center justify-center ${isEditing ? 'bg-red-500/20 border-red-500' : habit.completed_today ? 'bg-green-500/20 border-green-500' : 'bg-obsidian-void border-white/10'}`}>
                        {isEditing ? (
                            <IconSymbol name="trash" size={20} color="#EF4444" />
                        ) : habit.completed_today ? (
                            <IconSymbol name="checkmark" size={20} color="#22c55e" />
                        ) : (
                            <IconSymbol name="flame.fill" size={20} color="#333" />
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};
