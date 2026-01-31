import { BlurMask, Canvas, Circle, Paint, RadialGradient, vec } from '@shopify/react-native-skia';
import React, { useEffect } from 'react';
import { Dimensions, View } from 'react-native';
import { Easing, useDerivedValue, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const CENTER = vec(width / 2, height / 3);

// Magma colors
const CORE_COLOR = '#FF2E2E'; // Neon Red
const OUTER_COLOR = '#800000'; // Dark Red
const INACTIVE_COLOR = '#333333'; // Grey

interface AntiGravityEngineProps {
    active?: boolean;
    intensity?: number; // 0 to 1
}

export const AntiGravityEngine = ({ active = true, intensity = 0.5 }: AntiGravityEngineProps) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.8);
    const particles = Array.from({ length: 15 }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * (height * 0.4),
        r: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.2
    }));

    useEffect(() => {
        scale.value = withRepeat(
            withTiming(1.05 + intensity * 0.2, { duration: 3000 / (0.5 + intensity), easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
        opacity.value = withRepeat(
            withTiming(0.4, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, [intensity]);

    const radius = useDerivedValue(() => 80 * scale.value);

    return (
        <View style={{ width: width, height: height * 0.5, alignItems: 'center', justifyContent: 'center' }}>
            <Canvas style={{ flex: 1, width: width }}>
                {/* Background Particles */}
                {particles.map((p, i) => (
                    <Circle key={i} cx={p.x} cy={p.y} r={p.r}>
                        <Paint color={active ? CORE_COLOR : INACTIVE_COLOR} opacity={0.2} />
                        <BlurMask blur={2} style="normal" />
                    </Circle>
                ))}

                {/* Glow Effect */}
                <Circle cx={CENTER.x} cy={CENTER.y} r={radius}>
                    <RadialGradient
                        c={CENTER}
                        r={120}
                        colors={[active ? CORE_COLOR : INACTIVE_COLOR, 'transparent']}
                    />
                    <BlurMask blur={30} style="normal" />
                </Circle>

                {/* Core Sphere */}
                <Circle cx={CENTER.x} cy={CENTER.y} r={60}>
                    <RadialGradient
                        c={vec(CENTER.x - 15, CENTER.y - 15)}
                        r={80}
                        colors={[active ? '#FF5555' : '#555', active ? CORE_COLOR : INACTIVE_COLOR, active ? '#440000' : '#111']}
                    />
                </Circle>
            </Canvas>
        </View>
    );
};
