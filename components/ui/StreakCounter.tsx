import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { GlassPane } from './GlassPane';
import { IconSymbol } from './icon-symbol';

interface StreakCounterProps {
    streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
    const pulseScale = useSharedValue(1);
    const glowOpacity = useSharedValue(0.4);

    useEffect(() => {
        pulseScale.value = withRepeat(
            withSequence(
                withTiming(1.05, { duration: 2000 }),
                withTiming(1, { duration: 2000 })
            ),
            -1,
            true
        );

        glowOpacity.value = withRepeat(
            withSequence(
                withTiming(0.6, { duration: 1500 }),
                withTiming(0.3, { duration: 1500 })
            ),
            -1,
            true
        );
    }, []);

    useEffect(() => {
        if (streak > 0 && (streak % 7 === 0 || streak % 30 === 0 || streak % 100 === 0)) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    }, [streak]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    const getStreakColor = (streak: number) => {
        if (streak >= 365) return '#FFD700'; // Gold
        if (streak >= 100) return '#FF4500'; // Red-Orange
        if (streak >= 30) return '#FF8C00';  // Dark Orange
        if (streak >= 7) return '#FB923C';   // Orange
        return '#F97316';                   // Default Orange
    };

    const color = getStreakColor(streak);

    return (
        <View className="flex-1 min-w-[45%]">
            <GlassPane
                intensity={20}
                borderOpacity={0.05}
                style={styles.glass}
            >
                <View className="p-3 flex-row items-center gap-3">
                    <View style={styles.iconContainer}>
                        <Animated.View style={[styles.glow, { backgroundColor: color }, glowStyle]} />
                        <IconSymbol name="flame.fill" size={18} color={color} />
                    </View>

                    <View>
                        <Animated.Text
                            style={[styles.number, animatedStyle]}
                            className="text-text-primary font-black text-xl font-display"
                        >
                            {streak}
                        </Animated.Text>
                        <Text className="text-text-tertiary text-[9px] font-bold uppercase tracking-widest font-label">RACHA</Text>
                    </View>
                </View>

                {/* Milestone Indicator - Subtle bottom line */}
                {streak >= 7 && (
                    <View
                        style={[
                            styles.milestoneLine,
                            { backgroundColor: color }
                        ]}
                    />
                )}
            </GlassPane>
        </View>
    );
}

const styles = StyleSheet.create({
    glass: {
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'rgba(24, 24, 27, 0.6)',
    },
    iconContainer: {
        padding: 8,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    glow: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        filter: 'blur(8px)',
    },
    number: {
        // Removed fixed lineHeight to allow scaling
    },
    milestoneLine: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        opacity: 0.5,
    },
});
