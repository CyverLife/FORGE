import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';

interface RingProgressProps {
    radius?: number;
    strokeWidth?: number;
    progress: number; // 0 to 1
    color?: string;
    trackColor?: string;
    label?: string;
    subLabel?: string;
}

export const RingProgress = ({
    radius = 60,
    strokeWidth = 12,
    progress,
    color = '#F97316',
    trackColor = 'rgba(255,255,255,0.1)',
    label,
    subLabel
}: RingProgressProps) => {
    const innerRadius = radius - strokeWidth / 2;
    const path = Skia.Path.Make();
    path.addCircle(radius, radius, innerRadius);

    const targetProgress = useSharedValue(0);

    useEffect(() => {
        targetProgress.value = withTiming(progress, { duration: 1000 });
    }, [progress]);

    return (
        <View style={{ width: radius * 2, height: radius * 2, alignItems: 'center', justifyContent: 'center' }}>
            <Canvas style={StyleSheet.absoluteFill}>
                <Path
                    path={path}
                    color={trackColor}
                    style="stroke"
                    strokeWidth={strokeWidth}
                    strokeCap="round"
                />
                <Path
                    path={path}
                    color={color}
                    style="stroke"
                    strokeWidth={strokeWidth}
                    strokeCap="round"
                    start={0}
                    end={targetProgress}
                />
            </Canvas>
            <View className="items-center">
                {label && (
                    <Text className="text-white font-black text-2xl font-display">
                        {label}
                    </Text>
                )}
                {subLabel && (
                    <Text className="text-white/50 text-[10px] font-bold uppercase tracking-wider font-label">
                        {subLabel}
                    </Text>
                )}
            </View>
        </View>
    );
};
