import React, { useEffect } from 'react';
import { Canvas, Circle, Paint, RadialGradient, vec, useClock, useValue, useComputedValue, BlurMask } from '@shopify/react-native-skia';
import { useSharedValue, withRepeat, withTiming, Easing, useDerivedValue } from 'react-native-reanimated';
import { Dimensions, View } from 'react-native';

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

    // Animation loop
    useEffect(() => {
        scale.value = withRepeat(
            withTiming(1.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
        opacity.value = withRepeat(
            withTiming(0.4, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const radius = useDerivedValue(() => {
        return 80 * scale.value;
    });

    return (
        <View style={{ width: width, height: height * 0.6, alignItems: 'center', justifyContent: 'center' }}>
            <Canvas style={{ flex: 1, width: width, height: height * 0.6 }}>
                {/* Glow Effect */}
                <Circle cx={CENTER.x} cy={CENTER.y} r={radius}>
                    <RadialGradient
                        c={CENTER}
                        r={120}
                        colors={[active ? CORE_COLOR : INACTIVE_COLOR, 'transparent']}
                    />
                    <BlurMask blur={20} style="normal" />
                </Circle>

                {/* Core Sphere */}
                <Circle cx={CENTER.x} cy={CENTER.y} r={60}>
                    <RadialGradient
                        c={vec(CENTER.x - 20, CENTER.y - 20)}
                        r={80}
                        colors={[active ? '#FFaaaa' : '#555', active ? CORE_COLOR : INACTIVE_COLOR, active ? OUTER_COLOR : '#111']}
                    />
                </Circle>
            </Canvas>
        </View>
    );
};
