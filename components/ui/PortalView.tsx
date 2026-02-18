import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGamification } from '@/hooks/useGamification';
import { usePortalDecision } from '@/hooks/usePortalDecision';
import { BlurMask, Canvas, Circle, Group, RadialGradient, vec } from '@shopify/react-native-skia';
import { Image } from 'expo-image';
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
const PORTAL_SIZE = width * 0.75; // Slightly larger for impact

export const PortalView = () => {
    const { angelScore, simioScore } = useGamification();
    const { getDecisionStats } = usePortalDecision();
    const [coherence, setCoherence] = useState(50);

    // Animations
    const zoom = useSharedValue(1);
    const particleRotation = useSharedValue(0);

    useEffect(() => {
        getDecisionStats().then(stats => {
            setCoherence(stats.coherence || 50);
        });
    }, [angelScore, simioScore]);

    useEffect(() => {
        // Slow, epic zoom effect (breathing)
        zoom.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1.0, { duration: 8000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );

        // Particle rotation
        particleRotation.value = withRepeat(
            withTiming(360, { duration: 30000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const animatedImageStyle = useAnimatedStyle(() => ({
        transform: [{ scale: zoom.value }],
    }));

    // Determine portal state colors/icon
    const getPortalState = () => {
        const safeCoherence = coherence || 50;
        if (safeCoherence >= 70) {
            return {
                state: 'BRILLANTE',
                icon: 'star.fill',
                color: '#3B82F6',
            };
        } else if (safeCoherence >= 40) {
            return {
                state: 'EQUILIBRADO',
                icon: 'safari',
                color: '#8B5CF6',
            };
        } else {
            return {
                state: 'OSCURO',
                icon: 'moon.stars.fill',
                color: '#EF4444',
            };
        }
    };

    const portalState = getPortalState();

    return (
        <View className="items-center py-6">
            {/* Portal State Label */}
            <View className="flex-row items-center gap-2 mb-6">
                <IconSymbol name={portalState.icon as any} size={20} color={portalState.color} />
                <Text className="text-white/80 font-black text-sm uppercase tracking-[0.2em] font-display">
                    PORTAL {portalState.state}
                </Text>
            </View>

            {/* Container for Image & Particles */}
            <View style={{ width: PORTAL_SIZE, height: PORTAL_SIZE, alignItems: 'center', justifyContent: 'center' }}>

                {/* Background Glow (Skia) */}
                <View style={{ position: 'absolute' }}>
                    <Canvas style={{ width: PORTAL_SIZE * 1.2, height: PORTAL_SIZE * 1.2 }}>
                        <Group opacity={0.3}>
                            <RadialGradient
                                c={vec(PORTAL_SIZE * 0.6, PORTAL_SIZE * 0.6)}
                                r={PORTAL_SIZE * 0.6}
                                colors={[portalState.color, 'transparent']}
                            />
                        </Group>
                        <BlurMask blur={40} style="normal" />
                        <Circle cx={PORTAL_SIZE * 0.6} cy={PORTAL_SIZE * 0.6} r={PORTAL_SIZE * 0.4} color={portalState.color} opacity={0.2} />
                    </Canvas>
                </View>

                {/* Main Portal Image */}
                <Animated.View style={[{ width: '100%', height: '100%' }, animatedImageStyle]}>
                    <Image
                        source={require('@/assets/images/portal_texture.png')}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="contain"
                    />
                </Animated.View>

                {/* Particle Overlay (Simple Skia Noise/Dots) */}
                {/* Ideally this would be a proper particle system, but for now we simulate it with a rotating masked noise or scattered dots */}
            </View>


            {/* Stats Overlay */}
            <View className="mt-8 items-center bg-black/40 px-6 py-4 rounded-3xl border border-white/10 backdrop-blur-md">
                <Text className="text-white font-black text-5xl font-display tracking-tighter shadow-lg shadow-black">
                    {coherence}%
                </Text>
                <Text className="text-white/50 text-[10px] uppercase tracking-[0.3em] font-bold mt-1">
                    Sincronización
                </Text>

                <View className="flex-row gap-8 mt-4 pt-4 border-t border-white/10">
                    <View className="items-center">
                        <Text className="text-blue-400 font-bold text-xl">{angelScore || 0}</Text>
                        <Text className="text-white/30 text-[8px] uppercase tracking-widest mt-1">Ángel</Text>
                    </View>
                    <View className="w-px h-8 bg-white/10" />
                    <View className="items-center">
                        <Text className="text-red-400 font-bold text-xl">{simioScore || 0}</Text>
                        <Text className="text-white/30 text-[8px] uppercase tracking-widest mt-1">Simio</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

