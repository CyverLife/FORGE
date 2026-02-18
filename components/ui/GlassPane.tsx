import { BlurView } from 'expo-blur';
import React, { useEffect } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface GlassPaneProps extends ViewProps {
    intensity?: number;
    tint?: 'light' | 'dark' | 'default' | 'systemThinMaterialDark' | 'systemMaterialDark' | 'systemThickMaterialDark';
    borderOpacity?: number;
}

export const GlassPane = ({
    intensity = 20,
    tint = 'systemThinMaterialDark',
    borderOpacity = 0.1,
    style,
    children,
    ...props
}: GlassPaneProps) => {
    const sheenOpacity = useSharedValue(0.02);

    useEffect(() => {
        sheenOpacity.value = withRepeat(
            withSequence(
                withTiming(0.06, { duration: 3000 }),
                withTiming(0.02, { duration: 3000 })
            ),
            -1,
            true
        );
    }, []);

    const sheenStyle = useAnimatedStyle(() => ({
        backgroundColor: `rgba(255,255,255,${sheenOpacity.value})`,
    }));

    return (
        <View style={[styles.container, { borderColor: `rgba(255,255,255,${borderOpacity})` }, style]} {...props}>
            {/* Main Blur Layer */}
            <BlurView intensity={intensity} style={StyleSheet.absoluteFill} tint={tint} />

            {/* Breathing Sheen Overlay */}
            <Animated.View style={[StyleSheet.absoluteFill, sheenStyle]} />

            {/* Content Container */}
            <View style={{ zIndex: 1 }}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderWidth: 1,
    },
});
