import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';

interface GradientBackgroundProps extends ViewProps {
    children?: React.ReactNode;
}

/**
 * Subtle gradient background for premium depth
 * Pro Design 2026 standard - Zinc 950 with slight variation
 */
export const GradientBackground = ({ children, style }: GradientBackgroundProps) => {
    return (
        <LinearGradient
            colors={['#09090b', '#0a0a0c', '#09090b']} // Zinc 950 with subtle variation
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, style]}
        >
            {children}
        </LinearGradient>
    );
};
