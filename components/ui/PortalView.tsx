import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGamification } from '@/hooks/useGamification';
import { usePortalDecision } from '@/hooks/usePortalDecision';
import { getConsciousnessMessage } from '@/lib/consciousness-messages';
import { BlurMask, Canvas, Circle, RadialGradient, vec } from '@shopify/react-native-skia';
import React, { useEffect, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const PORTAL_SIZE = width * 0.6;

export const PortalView = () => {
    const { angelScore, simioScore } = useGamification();
    const { getDecisionStats } = usePortalDecision();
    const [coherence, setCoherence] = useState(50);

    // Animations
    const rotation = useSharedValue(0);
    const pulse = useSharedValue(1);
    const glow = useSharedValue(0.5);

    useEffect(() => {
        // Fetch coherence stats
        getDecisionStats().then(stats => {
            setCoherence(stats.coherence || 50);
        });
    }, [angelScore, simioScore]);

    useEffect(() => {
        // Continuous rotation
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 20000,
                easing: Easing.linear,
            }),
            -1,
            false
        );

        // Breathing effect - smooth, natural pulsing
        pulse.value = withRepeat(
            withSequence(
                withTiming(1.03, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1.0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );

        // Glow intensity based on coherence
        const glowIntensity = (coherence || 50) / 100;
        glow.value = withRepeat(
            withSequence(
                withTiming(glowIntensity + 0.2, { duration: 1500 }),
                withTiming(glowIntensity, { duration: 1500 })
            ),
            -1,
            true
        );
    }, [coherence]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${rotation.value}deg` },
            { scale: pulse.value },
        ],
    }));

    // Determine portal state
    const getPortalState = () => {
        const safeCoherence = coherence || 50;
        if (safeCoherence >= 70) {
            return {
                state: 'BRILLANTE',
                icon: 'star.fill',
                color1: '#3B82F6',
                color2: '#60A5FA',
                message: getConsciousnessMessage('ORO', 'IDLE'),
            };
        } else if (safeCoherence >= 40) {
            return {
                state: 'EQUILIBRADO',
                icon: 'safari',
                color1: '#8B5CF6',
                color2: '#A78BFA',
                message: getConsciousnessMessage('PLATA', 'IDLE'),
            };
        } else {
            return {
                state: 'OSCURO',
                icon: 'moon.stars.fill',
                color1: '#EF4444',
                color2: '#F87171',
                message: getConsciousnessMessage('BRONCE', 'IDLE'),
            };
        }
    };

    const portalState = getPortalState();

    return (
        <View className="items-center py-6">
            {/* Portal State Label */}
            <View className="flex-row items-center gap-2 mb-4">
                <IconSymbol name={portalState.icon as any} size={24} color={portalState.color1} />
                <Text className="text-text-primary font-black text-lg uppercase tracking-wider font-display">
                    PORTAL {portalState.state}
                </Text>
            </View>

            {/* Animated Portal - Spherical 3D Effect */}
            <Animated.View style={[{ width: PORTAL_SIZE, height: PORTAL_SIZE }, animatedStyle]}>
                <Canvas style={{ width: PORTAL_SIZE, height: PORTAL_SIZE }}>
                    {/* Atmosphere Glow (Outermost) - Enhanced with colored shadows */}
                    <Circle cx={PORTAL_SIZE / 2} cy={PORTAL_SIZE / 2} r={PORTAL_SIZE / 2}>
                        <RadialGradient
                            c={vec(PORTAL_SIZE / 2, PORTAL_SIZE / 2)}
                            r={PORTAL_SIZE / 2}
                            colors={[portalState.color2, 'transparent']}
                        />
                        <BlurMask blur={30} style="normal" />
                    </Circle>

                    {/* Colored glowing atmosphere (Shadow 1) */}
                    <Circle cx={PORTAL_SIZE / 2} cy={PORTAL_SIZE / 2} r={PORTAL_SIZE / 2 - 10} color={portalState.color1} opacity={glow}>
                        <BlurMask blur={20} style="normal" />
                    </Circle>

                    {/* Colored glowing atmosphere (Shadow 2) */}
                    <Circle cx={PORTAL_SIZE / 2} cy={PORTAL_SIZE / 2} r={PORTAL_SIZE / 2 - 20} color={portalState.color2} opacity={glow}>
                        <BlurMask blur={15} style="normal" />
                    </Circle>

                    {/* Main Sphere (Planet) with colored shadow */}
                    <Circle cx={PORTAL_SIZE / 2} cy={PORTAL_SIZE / 2} r={PORTAL_SIZE / 2 - 10}>
                        <RadialGradient
                            c={vec(PORTAL_SIZE * 0.3, PORTAL_SIZE * 0.3)} // Light source top-left
                            r={PORTAL_SIZE * 0.8}
                            colors={['white', portalState.color1, portalState.color2, 'black']}
                            positions={[0, 0.2, 0.6, 1]}
                        />
                    </Circle>

                    {/* Orbital Ring (The "Horizon" or "Energy Field") */}
                    <Circle
                        cx={PORTAL_SIZE / 2}
                        cy={PORTAL_SIZE / 2}
                        r={PORTAL_SIZE / 2 - 5}
                        style="stroke"
                        strokeWidth={2}
                        color="white"
                        opacity={0.3}
                    >
                        <BlurMask blur={2} style="solid" />
                    </Circle>

                    {/* Inner Core/Pupil */}
                    <Circle cx={PORTAL_SIZE / 2} cy={PORTAL_SIZE / 2} r={20} color="white" opacity={0.9}>
                        <BlurMask blur={10} style="normal" />
                    </Circle>
                </Canvas>
            </Animated.View>

            {/* Coherence Percentage */}
            <View className="mt-4 items-center">
                <Text className="text-text-primary font-black text-4xl font-display">
                    {coherence || 0}%
                </Text>
                <Text className="text-text-tertiary text-xs uppercase tracking-wider">
                    Coherencia
                </Text>
            </View>

            {/* Portal Message */}
            <View className="mt-4 px-6">
                <Text className="text-text-secondary text-sm text-center italic">
                    {portalState.message}
                </Text>
            </View>

            {/* Angel vs Simio Stats */}
            <View className="flex-row gap-8 mt-6">
                <View className="flex-row items-center gap-2">
                    <IconSymbol name="star.fill" size={28} color="#3B82F6" />
                    <Text className="text-blue-400 font-bold text-2xl">{angelScore || 0}</Text>
                    <Text className="text-text-tertiary text-xs">Ángel</Text>
                </View>

                <View className="w-px h-16 bg-border-subtle" />

                <View className="flex-row items-center gap-2">
                    <IconSymbol name="flame.fill" size={28} color="#EF4444" />
                    <Text className="text-red-400 font-bold text-2xl">{simioScore || 0}</Text>
                    <Text className="text-text-tertiary text-xs">Simio</Text>
                </View>
            </View>

            {/* Portal Power Bar */}
            <View className="w-full px-8 mt-6">
                <View className="h-2 bg-card-black rounded-full overflow-hidden">
                    <View
                        className="h-full bg-blue-500"
                        style={{ width: `${coherence || 0}%` }}
                    />
                </View>
                <View className="flex-row justify-between mt-2">
                    <Text className="text-text-tertiary text-[10px]">Simio</Text>
                    <Text className="text-text-tertiary text-[10px]">Ángel</Text>
                </View>
            </View>
        </View>
    );
};
