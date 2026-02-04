import { BlurMask, Canvas, Circle, Path, Skia } from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

interface AttributeRadarProps {
    stats: {
        iron: number; // Volume
        fire: number; // Streak
        steel: number; // Consistency
        focus: number; // Daily Rate
    };
    size?: number;
}

export const AttributeRadar = ({ stats, size = 200 }: AttributeRadarProps) => {
    const center = size / 2;
    const radius = (size - 40) / 2; // Padding

    // Animate stats 0-100 to normalized 0-1
    // For now we assume props come in 0-100 range.

    const points = useMemo(() => {
        const p = [];
        const categories = ['IRON', 'FIRE', 'STEEL', 'FOCUS'];
        const values = [stats.iron, stats.fire, stats.steel, stats.focus];

        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI * 2 * i) / 4 - Math.PI / 2; // Start at top
            const val = Math.min(Math.max(values[i], 10), 100) / 100; // Clamp 10-100, normalize
            const x = center + Math.cos(angle) * (radius * val);
            const y = center + Math.sin(angle) * (radius * val);
            p.push({ x, y, label: categories[i], val: values[i] });
        }
        return p;
    }, [stats, size]);

    // Create the polygon path
    const path = useMemo(() => {
        const skPath = Skia.Path.Make();
        if (points.length === 0) return skPath;
        skPath.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            skPath.lineTo(points[i].x, points[i].y);
        }
        skPath.close();
        return skPath;
    }, [points]);

    // Background Web Grid (Static)
    const gridPath = useMemo(() => {
        const skPath = Skia.Path.Make();
        const steps = 4;
        for (let s = 1; s <= steps; s++) {
            const r = (radius / steps) * s;
            for (let i = 0; i < 4; i++) {
                const angle = (Math.PI * 2 * i) / 4 - Math.PI / 2;
                const x = center + Math.cos(angle) * r;
                const y = center + Math.sin(angle) * r;
                if (i === 0) skPath.moveTo(x, y);
                else skPath.lineTo(x, y);
            }
            skPath.close();
        }
        // Cross lines
        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI * 2 * i) / 4 - Math.PI / 2;
            skPath.moveTo(center, center);
            skPath.lineTo(center + Math.cos(angle) * radius, center + Math.sin(angle) * radius);
        }
        return skPath;
    }, [size]);

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Canvas style={{ width: size, height: size, position: 'absolute' }}>
                {/* Background Grid */}
                <Path
                    path={gridPath}
                    style="stroke"
                    strokeWidth={1}
                    color="rgba(255, 255, 255, 0.1)"
                />

                {/* Data Polygon Fill */}
                <Path
                    path={path}
                    style="fill"
                    color="rgba(249, 115, 22, 0.2)"
                />

                {/* Data Polygon Stroke */}
                <Path
                    path={path}
                    style="stroke"
                    strokeWidth={3}
                    color="#F97316"
                    strokeCap="round"
                    strokeJoin="round"
                >
                    <BlurMask blur={4} style="solid" />
                </Path>

                {/* Core Glow */}
                <Circle cx={center} cy={center} r={4} color="#F97316">
                    <BlurMask blur={4} style="normal" />
                </Circle>
            </Canvas>

            {/* Labels (React Native views for easier text handling than Skia Font loading) */}
            {points.map((p, i) => {
                // Adjust label position slightly based on quadrant
                const isTop = i === 0;
                const isRight = i === 1;
                const isBottom = i === 2;
                const isLeft = i === 3;

                const labelStyle = {
                    position: 'absolute' as const,
                    left: isLeft ? 10 : isRight ? undefined : undefined,
                    right: isRight ? 10 : undefined,
                    top: isTop ? 10 : undefined,
                    bottom: isBottom ? 10 : undefined,
                    // Centering top/bottom
                    transform: isTop || isBottom ? [{ translateX: i === 0 || i === 2 ? 0 : 0 }] : [],
                    width: '100%',
                    textAlign: isLeft ? 'left' : isRight ? 'right' : 'center',
                };

                // For simplicity in this layout, specific absolute positioning based on index
                // 0: TOP (Iron), 1: RIGHT (Steel?), 2: BOTTOM (Focus?), 3: LEFT (Fire?)
                // Actually our order was Iron, Fire, Steel, Focus
                // 0 (Top): IRON
                // 1 (Right): FIRE
                // 2 (Bottom): STEEL
                // 3 (Left): FOCUS

                return (
                    <View key={i} style={{
                        position: 'absolute',
                        top: isTop ? 0 : isBottom ? size - 20 : (size / 2) - 10,
                        left: isLeft ? 0 : isRight ? size - 50 : (size / 2) - 25,
                        width: 50,
                        alignItems: 'center'
                    }}>
                        <Text className="text-[10px] font-black text-white/50 bg-black/50 px-1 rounded uppercase tracking-widest">
                            {p.label}
                        </Text>
                        <Text className="text-[10px] font-bold text-orange-400">
                            {Math.round(p.val)}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
};
