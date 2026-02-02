import { BackdropBlur, Canvas, RoundedRect, Shadow } from '@shopify/react-native-skia';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface SkiaGlassPaneProps extends ViewProps {
    blurAmount?: number;
    cornerRadius?: number;
    backgroundColor?: string; // rgba format
    shadowColor?: string;
    borderColor?: string;
    borderWidth?: number;
    width?: number;
    height?: number;
}

/**
 * Premium glassmorphism component using Skia's BackdropBlur
 * for authentic iOS-like frosted glass effect with colored shadows
 */
export const SkiaGlassPane = ({
    blurAmount = 20,
    cornerRadius = 16,
    backgroundColor = 'rgba(0,0,0,0.4)',
    shadowColor = 'rgba(255,255,255,0.1)',
    borderColor = 'rgba(255,255,255,0.1)',
    borderWidth = 0.5,
    width: propWidth,
    height: propHeight,
    children,
    style,
    ...props
}: SkiaGlassPaneProps) => {
    const [layout, setLayout] = React.useState({ width: 0, height: 0 });

    const handleLayout = React.useCallback((event: any) => {
        const { width, height } = event.nativeEvent.layout;
        setLayout({ width, height });
    }, []);

    // Use prop dimensions if provided, otherwise use measured layout
    const finalWidth = propWidth || layout.width;
    const finalHeight = propHeight || layout.height;

    // Only render canvas if we have dimensions (or if explicit props were passed)
    const isReady = finalWidth > 0 && finalHeight > 0;

    return (
        <View
            style={[{ position: 'relative' }, style]}
            onLayout={handleLayout}
            {...props}
        >
            {/* Skia Canvas Background Layer */}
            {isReady && (
                <Canvas style={StyleSheet.absoluteFill}>
                    <BackdropBlur blur={blurAmount}>
                        <RoundedRect
                            x={0}
                            y={0}
                            width={finalWidth}
                            height={finalHeight}
                            r={cornerRadius}
                            color={backgroundColor}
                        >
                            {/* Outer glow shadow */}
                            <Shadow dx={0} dy={4} blur={20} color={shadowColor} />

                            {/* Inner/Bevel highlight (optional, can be simulated with another shadow or inset) */}
                            {/* <Shadow dx={0} dy={-1} blur={1} color="rgba(255,255,255,0.1)" inner /> */}
                        </RoundedRect>

                        {/* Border (drawn as stroke) */}
                        {borderWidth > 0 && (
                            <RoundedRect
                                x={borderWidth / 2}
                                y={borderWidth / 2}
                                width={finalWidth - borderWidth}
                                height={finalHeight - borderWidth}
                                r={cornerRadius}
                                color={borderColor}
                                style="stroke"
                                strokeWidth={borderWidth}
                            />
                        )}
                    </BackdropBlur>
                </Canvas>
            )}

            {/* Content Layer */}
            <View style={styles.contentContainer}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        zIndex: 1,
        flex: 1,
    },
});
