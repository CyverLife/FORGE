import { Canvas, Fill, Shader, Skia, vec } from '@shopify/react-native-skia';
import React, { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useDerivedValue, useFrameCallback, useSharedValue } from 'react-native-reanimated';

export interface AmbientBackgroundProps {
    streakStatus: 'WinningStreak' | 'Danger' | 'Neutral';
}

const { width, height } = Dimensions.get('window');

// Shader GLSL (SkSL) for dynamic background
const shaderSource = `
uniform float iTime;
uniform vec2 iResolution;
uniform int streakStatus;

// Simplified noise function (Perlin-like)
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0)))); }
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
}

vec4 main(vec2 pos) {
  vec2 uv = pos / iResolution;
  vec3 color = vec3(0.0);

  float n = noise(uv * 5.0 + iTime * 0.1); // Base noise

  if (streakStatus == 0) { // Neutral: Dark, subtle, with a touch of noise
    color = vec3(0.05, 0.05, 0.07) + n * 0.02; // Darker for Heroes Academy aesthetic
  } else if (streakStatus == 1) { // WinningStreak: Gold/Orange tones, pulsating
    float pulse = sin(iTime * 2.0) * 0.2 + 0.8;
    color = vec3(0.6, 0.4, 0.1) * pulse + n * 0.1; 
  } else if (streakStatus == 2) { // Danger: Red tones, pulsating
    float pulse = sin(iTime * 4.0) * 0.3 + 0.7;
    color = vec3(0.4, 0.05, 0.05) * pulse + n * 0.15;
  }

  return vec4(color, 1.0);
}
`;

const skiaShader = Skia.RuntimeEffect.Make(shaderSource);

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ streakStatus }) => {
    const time = useSharedValue(0);
    const iResolution = useSharedValue(vec(width, height));
    const statusVal = useSharedValue(0);

    const targetStatusInt = useMemo(() => {
        if (streakStatus === 'WinningStreak') return 1;
        if (streakStatus === 'Danger') return 2;
        return 0;
    }, [streakStatus]);

    useEffect(() => {
        statusVal.value = targetStatusInt;
    }, [targetStatusInt]);

    useFrameCallback((frameInfo) => {
        time.value = frameInfo.timeSinceFirstFrame / 1000;
    });

    const uniforms = useDerivedValue(() => {
        return {
            iTime: time.value,
            iResolution: iResolution.value,
            streakStatus: statusVal.value,
        };
    }, [time, iResolution, statusVal]);

    if (!skiaShader) {
        return <View style={[styles.container, { backgroundColor: '#000' }]} />;
    }

    return (
        <View style={styles.container}>
            <Canvas style={styles.canvas}>
                <Fill>
                    <Shader source={skiaShader} uniforms={uniforms} />
                </Fill>
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
    },
    canvas: {
        flex: 1,
    },
});
