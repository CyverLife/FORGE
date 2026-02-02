import { usePortalDecision } from '@/hooks/usePortalDecision';
import { BlurMask, Canvas, Path, Skia } from '@shopify/react-native-skia';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CHART_HEIGHT = 160;
const CHART_WIDTH = width - 40; // Padding
const PADDING_VERTICAL = 20;

export const CoherenceChart = () => {
    const { getRecentDecisions } = usePortalDecision();
    const [decisions, setDecisions] = useState<{ type: 'ANGEL' | 'APE'; created_at: string }[]>([]);

    useEffect(() => {
        getRecentDecisions(15).then(data => {
            // Reverse to show chronological order (oldest -> newest) from left to right
            setDecisions(data.reverse());
        });
    }, []);

    const path = useMemo(() => {
        const skPath = Skia.Path.Make();
        if (decisions.length === 0) return skPath;

        const stepX = CHART_WIDTH / (decisions.length - 1 || 1);
        // Start at middle
        let currentY = CHART_HEIGHT / 2;
        skPath.moveTo(0, currentY);

        decisions.forEach((d, index) => {
            // Angel goes UP (lower Y), Ape goes DOWN (higher Y)
            // Clamping to keep inside chart
            const change = d.type === 'ANGEL' ? -20 : 20;
            currentY = Math.max(PADDING_VERTICAL, Math.min(CHART_HEIGHT - PADDING_VERTICAL, currentY + change));

            // Smooth curve
            if (index === 0) {
                skPath.moveTo(index * stepX, currentY);
            } else {
                const prevX = (index - 1) * stepX;
                const curX = index * stepX;
                const cp1x = prevX + (curX - prevX) / 2;
                const cp1y = skPath.getLastPt().y; // Previous Y
                const cp2x = prevX + (curX - prevX) / 2;
                const cp2y = currentY;

                skPath.cubicTo(cp1x, cp1y, cp2x, cp2y, curX, currentY);
            }
        });

        return skPath;
    }, [decisions]);

    // Calculate current coherence trend
    const trend = useMemo(() => {
        if (decisions.length < 2) return 0;
        const last = decisions[decisions.length - 1];
        return last.type === 'ANGEL' ? '+5%' : '-2%';
    }, [decisions]);

    const isPositive = decisions.length > 0 && decisions[decisions.length - 1].type === 'ANGEL';

    return (
        <Animated.View
            entering={FadeInDown.delay(200).springify()}
            className="w-full bg-card-black/50 border border-white/10 rounded-3xl overflow-hidden mb-6"
            style={{ height: 220 }}
        >
            {/* Header Data */}
            <View className="absolute top-4 left-4 z-10">
                <Text className="text-text-tertiary text-xs uppercase tracking-widest font-bold">COHERENCIA</Text>
                <View className="flex-row items-baseline gap-2">
                    <Text className="text-white text-3xl font-black font-display tracking-tighter">
                        {decisions.length > 0 ? (isPositive ? 'ASCENSO' : 'DESCENSO') : 'NEUTRAL'}
                    </Text>
                    <View className={`px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                        <Text className={`text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                            {trend} (24h)
                        </Text>
                    </View>
                </View>
            </View>

            {/* Skia Chart */}
            <Canvas style={{ width: CHART_WIDTH, height: CHART_HEIGHT, position: 'absolute', bottom: 0 }}>
                {/* Grid Lines */}
                {/* Line Path */}
                <Path
                    path={path}
                    style="stroke"
                    strokeWidth={4}
                    color={isPositive ? "#10B981" : "#EF4444"}
                    strokeCap="round"
                    strokeJoin="round"
                >
                    {/* Neon Glow */}
                    <BlurMask blur={6} style="solid" />
                </Path>

                {/* Second layer for core brightness intensity */}
                <Path
                    path={path}
                    style="stroke"
                    strokeWidth={2}
                    color="white"
                    opacity={0.8}
                    strokeCap="round"
                    strokeJoin="round"
                />

                {/* Gradient Fill below line (Optional, tricky with open path) */}
            </Canvas>
        </Animated.View>
    );
};
