import { IconSymbol } from '@/components/ui/icon-symbol';
import { VariableReward } from '@/lib/rewards';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeInUp,
    FadeOutDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

interface RewardPopupProps {
    reward: VariableReward;
    visible: boolean;
    onComplete: () => void;
}

export function RewardPopup({ reward, visible, onComplete }: RewardPopupProps) {
    const scale = useSharedValue(0.8);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            // Trigger haptic feedback
            if (reward.criticalHit) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } else {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }

            // Animate in
            scale.value = withSpring(1, { damping: 12 });
            opacity.value = withTiming(1, { duration: 200 });

            // Auto-dismiss
            const timer = setTimeout(() => {
                scale.value = withTiming(0.8, { duration: 300 });
                opacity.value = withTiming(0, { duration: 300 }, () => {
                    // callback to reset
                });

                // Wait for animation to finish before calling onComplete
                setTimeout(onComplete, 350);
            }, 2000);

            return () => clearTimeout(timer);
        } else {
            scale.value = 0.8;
            opacity.value = 0;
        }
    }, [visible, reward]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    if (!visible) return null;

    const isCritical = reward.criticalHit;
    const containerStyle = isCritical ? styles.criticalContainer : styles.normalContainer;

    return (
        <Animated.View
            entering={FadeInUp.springify()}
            exiting={FadeOutDown.duration(300)}
            style={[styles.container, animatedStyle]}
            pointerEvents="none"
        >
            <LinearGradient
                colors={isCritical ? ['#FFD700', '#FF8C00', '#FF4500'] : ['#FF6B00', '#FF8500']}
                style={[styles.card, containerStyle]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {isCritical && (
                    <View style={styles.criticalBurst}>
                        <IconSymbol name="star.fill" size={60} color="#FFFFFF" />
                    </View>
                )}

                <View style={styles.content}>
                    {reward.bonusMessage && (
                        <Text style={[styles.bonusText, isCritical && styles.criticalText]}>
                            {reward.bonusMessage}
                        </Text>
                    )}

                    <View style={styles.xpContainer}>
                        <Text style={[styles.xpAmount, isCritical && styles.criticalXP]}>
                            +{reward.totalXP}
                        </Text>
                        <Text style={styles.xpLabel}>XP</Text>
                    </View>

                    {reward.streakBonus > 0 && (
                        <View style={styles.streakBadge}>
                            <IconSymbol name="flame.fill" size={14} color="#FF4500" />
                            <Text style={styles.streakText}>x{reward.streakBonus.toFixed(1)} Racha</Text>
                        </View>
                    )}
                </View>
            </LinearGradient>
        </Animated.View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '40%',
        alignSelf: 'center',
        zIndex: 9999,
        elevation: 10,
    },
    card: {
        paddingHorizontal: 32,
        paddingVertical: 24,
        borderRadius: 24,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: '#FF4500',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.6,
        shadowRadius: 16,
        elevation: 10,
        minWidth: width * 0.7,
    },
    normalContainer: {
        backgroundColor: '#1a1a1aee',
    },
    criticalContainer: {
        backgroundColor: '#000000ee',
    },
    content: {
        alignItems: 'center',
        gap: 8,
    },
    bonusText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    criticalText: {
        fontSize: 20,
        fontWeight: '900',
        textShadowColor: '#FFD700',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    xpContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
    },
    xpAmount: {
        fontSize: 56,
        fontWeight: 'black',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    criticalXP: {
        fontSize: 72,
        color: '#FFD700',
        textShadowColor: '#FF4500',
        textShadowRadius: 12,
    },
    xpLabel: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'rgba(255, 255, 255, 0.8)',
    },
    streakBadge: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 69, 0, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 69, 0, 0.4)',
    },
    streakText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    criticalBurst: {
        position: 'absolute',
        top: -20,
        right: -20,
        transform: [{ rotate: '25deg' }],
    },
});
