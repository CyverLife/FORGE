import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGamification } from '@/hooks/useGamification';
import { PortalDecisionType, usePortalDecision } from '@/hooks/usePortalDecision';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import { getConsciousnessMessage } from '@/lib/consciousness-messages';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

interface PortalDecisionModalProps {
    visible: boolean;
    habitId?: string;
    habitTitle?: string;
    onDecision: (decision: PortalDecisionType) => void;
    onClose: () => void;
}

export const PortalDecisionModal: React.FC<PortalDecisionModalProps> = ({
    visible,
    habitId,
    habitTitle,
    onDecision,
    onClose,
}) => {
    const { recordDecision, isRecording } = usePortalDecision();
    const { consciousnessRank } = useGamification();
    const { playSound } = useSoundSystem();

    // Animations
    const portalScale = useSharedValue(0.8);
    const portalOpacity = useSharedValue(0);
    const brightenGlow = useSharedValue(0);
    const darkenGlow = useSharedValue(0);

    // Get a stable message that doesn't change on re-renders, updates when visible changes
    const message = useMemo(() => {
        if (!visible) return '';
        return getConsciousnessMessage(consciousnessRank, 'PORTAL_DECISION');
    }, [visible, consciousnessRank]);

    useEffect(() => {
        if (visible) {
            // Portal entrance animation
            portalScale.value = withSpring(1, { damping: 15 });
            portalOpacity.value = withTiming(1, { duration: 300 });

            // Sound
            playSound('portal_open');
        } else {
            portalScale.value = 0.8;
            portalOpacity.value = 0;
            brightenGlow.value = 0;
            darkenGlow.value = 0;
        }
    }, [visible]);

    const handlePress = async (decision: PortalDecisionType) => {
        // Differentiated haptic feedback based on decision
        if (decision === 'BRIGHTEN') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }

        // Animate the chosen option
        if (decision === 'BRIGHTEN') {
            playSound('decision_angel');
            brightenGlow.value = withSequence(
                withTiming(1, { duration: 200 }),
                withTiming(0, { duration: 400 })
            );
        } else {
            playSound('decision_simio');
            darkenGlow.value = withSequence(
                withTiming(1, { duration: 200 }),
                withTiming(0, { duration: 400 })
            );
        }

        // Record decision
        await recordDecision(decision, habitId);

        // Notify parent and close
        setTimeout(() => {
            onDecision(decision);
            onClose();
        }, 600);
    };

    const portalStyle = useAnimatedStyle(() => ({
        transform: [{ scale: portalScale.value }],
        opacity: portalOpacity.value,
    }));

    const brightenGlowStyle = useAnimatedStyle(() => ({
        opacity: brightenGlow.value * 0.6,
    }));

    const darkenGlowStyle = useAnimatedStyle(() => ({
        opacity: darkenGlow.value * 0.6,
    }));

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/90 justify-center items-center px-6">
                <Animated.View style={portalStyle} className="w-full max-w-md">
                    {/* Portal Question */}
                    <View className="items-center mb-8">
                        <Text className="text-text-primary font-black text-2xl text-center mb-2 font-display">
                            ¿ESTA DECISIÓN HACE QUE TU PORTAL...?
                        </Text>
                        {habitTitle && (
                            <Text className="text-text-secondary text-sm text-center">
                                {habitTitle}
                            </Text>
                        )}
                    </View>

                    {/* Portal Visualization */}
                    <View className="items-center mb-8">
                        <View className="w-48 h-48 items-center justify-center">
                            {/* Portal Circle */}
                            <View className="absolute w-48 h-48 rounded-full border-4 border-forge-orange/30" />

                            {/* Brighten Glow */}
                            <Animated.View
                                style={[{ position: 'absolute', width: 200, height: 200 }, brightenGlowStyle]}
                            >
                                <LinearGradient
                                    colors={['rgba(59, 130, 246, 0.5)', 'transparent']}
                                    style={{ flex: 1, borderRadius: 100 }}
                                />
                            </Animated.View>

                            {/* Darken Glow */}
                            <Animated.View
                                style={[{ position: 'absolute', width: 200, height: 200 }, darkenGlowStyle]}
                            >
                                <LinearGradient
                                    colors={['rgba(239, 68, 68, 0.5)', 'transparent']}
                                    style={{ flex: 1, borderRadius: 100 }}
                                />
                            </Animated.View>

                            {/* Portal Icon */}
                            <Text style={{ fontSize: 80 }}>🌀</Text>
                        </View>
                    </View>

                    {/* Decision Buttons */}
                    <View className="gap-4">
                        {/* BRIGHTEN - Angel Decision */}
                        <TouchableOpacity
                            onPress={() => handlePress('BRIGHTEN')}
                            disabled={isRecording}
                            className="active:scale-95"
                        >
                            <LinearGradient
                                colors={['#3B82F6', '#1D4ED8']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="p-6 rounded-premium flex-row items-center justify-between"
                            >
                                <View className="flex-row items-center gap-3">
                                    <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
                                        <IconSymbol name="star.fill" size={24} color="#FFFFFF" />
                                    </View>
                                    <View>
                                        <Text className="text-white font-black text-xl font-display">
                                            BRILLAR
                                        </Text>
                                        <Text className="text-white/70 text-xs">
                                            Decisión del Ángel
                                        </Text>
                                    </View>
                                </View>
                                <IconSymbol name="arrow.up.circle.fill" size={28} color="#FFFFFF" />
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* DARKEN - Simio Decision */}
                        <TouchableOpacity
                            onPress={() => handlePress('DARKEN')}
                            disabled={isRecording}
                            className="active:scale-95"
                        >
                            <LinearGradient
                                colors={['#EF4444', '#991B1B']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="p-6 rounded-premium flex-row items-center justify-between"
                            >
                                <View className="flex-row items-center gap-3">
                                    <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
                                        <IconSymbol name="flame.fill" size={24} color="#FFFFFF" />
                                    </View>
                                    <View>
                                        <Text className="text-white font-black text-xl font-display">
                                            OSCURECER
                                        </Text>
                                        <Text className="text-white/70 text-xs">
                                            Decisión del Simio
                                        </Text>
                                    </View>
                                </View>
                                <IconSymbol name="arrow.down.circle.fill" size={28} color="#FFFFFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Philosophy Quote */}
                    <View className="mt-8 p-4 bg-card-black rounded-card border border-border-subtle">
                        <Text className="text-text-tertiary text-xs text-center italic">
                            "{message || "Cada decisión es un golpe de cincel que moldea tu realidad"}"
                        </Text>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};
