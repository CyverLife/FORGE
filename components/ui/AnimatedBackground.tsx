import React from 'react';
import { View } from 'react-native';

export const AnimatedBackground = ({ children }: { children?: React.ReactNode }) => {
    // Heroes Academy Aesthetic: Deep Black with subtle grid
    return (
        <View style={{ flex: 1, backgroundColor: '#0E0E0E' }}>
            {/* Premium Grid Pattern - Same as Splash */}
            <View style={{ position: 'absolute', width: '100%', height: '100%', opacity: 1 }}>
                {/* Vertical Lines */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <View
                        key={`v-${i}`}
                        style={{
                            position: 'absolute',
                            left: `${(i + 1) * 12.5}%`,
                            top: 0,
                            bottom: 0,
                            width: 1,
                            backgroundColor: 'rgba(255,255,255,0.03)'
                        }}
                    />
                ))}
                {/* Horizontal Lines */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <View
                        key={`h-${i}`}
                        style={{
                            position: 'absolute',
                            top: `${(i + 1) * 8.33}%`,
                            left: 0,
                            right: 0,
                            height: 1,
                            backgroundColor: 'rgba(255,255,255,0.03)'
                        }}
                    />
                ))}
            </View>

            <View style={{ flex: 1 }}>{children}</View>
        </View>
    );
};
