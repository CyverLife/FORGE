import React from 'react';
import { Canvas, BackdropBlur, Fill } from '@shopify/react-native-skia';
import { View, StyleSheet, ViewProps } from 'react-native';

interface GlassPaneProps extends ViewProps {
    blurAmount?: number;
    opacity?: number;
}

export const GlassPane = ({ blurAmount = 10, opacity = 0.1, style, children, ...props }: GlassPaneProps) => {
    return (
        <View style={[styles.container, style]} {...props}>
            <Canvas style={StyleSheet.absoluteFill}>
                <BackdropBlur blur={blurAmount} clip={undefined}>
                    <Fill color={`rgba(255, 255, 255, ${opacity})`} />
                </BackdropBlur>
            </Canvas>
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
