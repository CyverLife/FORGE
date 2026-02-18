import { Canvas, Circle, Group } from '@shopify/react-native-skia';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { runOnJS, useDerivedValue, useFrameCallback, useSharedValue } from 'react-native-reanimated';

// Force full screen dimensions for the overlay
const { width, height } = Dimensions.get('window');

interface ParticleExplosionProps {
    trigger: boolean;
    position: { x: number; y: number };
    color?: string;
    onComplete?: () => void;
}

export const ParticleExplosion: React.FC<ParticleExplosionProps> = ({
    trigger,
    position,
    color = "#FFD700", // Gold
    onComplete,
}) => {
    return (
        <Canvas style={[StyleSheet.absoluteFill, { zIndex: 999 }]} pointerEvents="none">
            <ParticleSystem trigger={trigger} position={position} color={color} onComplete={onComplete} />
        </Canvas>
    );
};

const ParticleSystem = ({ trigger, position, color, onComplete }: ParticleExplosionProps) => {
    const time = useSharedValue(0);
    const startTime = useSharedValue(-1);
    const completed = useSharedValue(false);

    useFrameCallback((frameInfo) => {
        if (!trigger) {
            time.value = 0;
            return;
        }

        time.value = frameInfo.timeSinceFirstFrame / 1000;

        // Handle completion
        if (startTime.value !== -1) {
            const t = time.value - startTime.value;
            if (t > 1.5 && !completed.value) {
                completed.value = true;
                if (onComplete) {
                    runOnJS(onComplete)();
                }
            }
        }
    });

    useEffect(() => {
        if (trigger) {
            startTime.value = time.value;
            completed.value = false;
        } else {
            startTime.value = -1;
        }
    }, [trigger]);

    if (!trigger) return null;

    return (
        <Group>
            {Array.from({ length: 20 }).map((_, i) => (
                <Particle
                    key={i}
                    index={i}
                    time={time}
                    startTime={startTime}
                    origin={position}
                    color={color}
                />
            ))}
        </Group>
    );
};

const Particle = ({ index, time, startTime, origin, color }: { index: number, time: any, startTime: any, origin: { x: number, y: number }, color?: string }) => {
    const geometry = useDerivedValue(() => {
        if (startTime.value === -1) return { x: origin.x, y: origin.y, r: 0, opacity: 0 };
        const t = time.value - startTime.value;
        if (t < 0) return { x: origin.x, y: origin.y, r: 0, opacity: 0 };

        const angle = (index * 137.5) * (Math.PI / 180);
        const speed = 150 + (index * 1234.56 % 100);

        const x = origin.x + Math.cos(angle) * speed * t;
        const y = origin.y + Math.sin(angle) * speed * t + (400 * t * t); // Gravity

        const opacity = Math.max(0, 1 - t / 1.5);
        const r = (3 + (index % 4));

        return { x, y, r, opacity };
    }, [time, startTime, index, origin]);

    const cx = useDerivedValue(() => geometry.value.x);
    const cy = useDerivedValue(() => geometry.value.y);
    const r = useDerivedValue(() => geometry.value.r);
    const opacity = useDerivedValue(() => geometry.value.opacity);

    return <Circle cx={cx} cy={cy} r={r} color={color} opacity={opacity} />;
};
