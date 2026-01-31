import { BackdropBlur, Canvas, Fill } from '@shopify/react-native-skia';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface GlassPaneProps extends ViewProps {
    blurAmount?: number;
    opacity?: number;
}

export const GlassPane = ({ blurAmount = 15, opacity = 0.08, style, children, ...props }: GlassPaneProps) => {
    return (
        <View style={[styles.container, style]} {...props}>
            <Canvas style={StyleSheet.absoluteFill}>
                <BackdropBlur blur={blurAmount} clip={undefined}>
                    <Fill color={`rgba(30, 30, 30, ${opacity})`} />
                </BackdropBlur>
            </Canvas>
            {/* Subtle inner gloss highlight */}
            <View style={[StyleSheet.absoluteFill, { borderColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderRadius: 24 }]} />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: 'rgba(30,30,30,0.4)', // Fallback / Base tint
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
    },
});
