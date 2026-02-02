import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

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
    return (
        <View style={[styles.container, { borderColor: `rgba(255,255,255,${borderOpacity})` }, style]} {...props}>
            {/* Main Blur Layer */}
            <BlurView intensity={intensity} style={StyleSheet.absoluteFill} tint={tint} />

            {/* Subtle Gradient Overlay for "Sheen" */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.02)' }]} />

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
        // No explicit background color needed if BlurView works, mostly handled by tint
    },
});
