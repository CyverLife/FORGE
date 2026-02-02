import { Pressable, PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends PressableProps {
    scaleValue?: number; // Default 0.95 for subtle press effect
}

/**
 * Pressable component with micro-interaction scale animation
 * Following Pro Design 2026 guidelines for premium tactile feedback
 */
export const PressableScale = ({
    scaleValue = 0.95,
    children,
    ...props
}: PressableScaleProps) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <AnimatedPressable
            {...props}
            style={[props.style, animatedStyle]}
            onPressIn={(e) => {
                scale.value = withSpring(scaleValue, { damping: 15, stiffness: 200 });
                props.onPressIn?.(e);
            }}
            onPressOut={(e) => {
                scale.value = withSpring(1, { damping: 15, stiffness: 200 });
                props.onPressOut?.(e);
            }}
        >
            {children}
        </AnimatedPressable>
    );
};
