import { Canvas, Circle, Group, Line, Paint, vec } from '@shopify/react-native-skia';
import React, { useEffect } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { GlassPane } from '../ui/GlassPane';

const { width } = Dimensions.get('window');

interface Node {
    id: string;
    x: number;
    y: number;
    title: string;
    requiredLevel: number;
    unlocked: boolean;
}

const SKILL_NODES: Node[] = [
    { id: '1', x: width * 0.5, y: 50, title: 'Spark', requiredLevel: 1, unlocked: true },
    { id: '2', x: width * 0.3, y: 150, title: 'Kindle', requiredLevel: 5, unlocked: false },
    { id: '3', x: width * 0.7, y: 150, title: 'Ember', requiredLevel: 5, unlocked: false },
    { id: '4', x: width * 0.5, y: 250, title: 'Blaze', requiredLevel: 10, unlocked: false },
    { id: '5', x: width * 0.5, y: 350, title: 'Inferno', requiredLevel: 20, unlocked: false },
];

export const SkillTree = ({ attribute = 'FIRE' }: { attribute?: string }) => {
    const pulse = useSharedValue(0.5);

    useEffect(() => {
        pulse.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1500 }),
                withTiming(0.5, { duration: 1500 })
            ),
            -1,
            true
        );
    }, []);

    const getColor = (unlocked: boolean) => {
        if (!unlocked) return '#333';
        switch (attribute) {
            case 'FIRE': return '#F97316'; // Orange
            case 'IRON': return '#9CA3AF'; // Gray
            case 'STEEL': return '#3B82F6'; // Blue
            case 'FOCUS': return '#A855F7'; // Purple
            default: return '#FF2E2E';
        }
    };

    return (
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 50 }}>
            <View className="items-center mt-6 mb-4">
                <Text className="text-white text-2xl font-bold tracking-widest">{attribute} MASTERY</Text>
                <Text className="text-gray-500 text-xs">Unlock nodes to gain permanent buffs.</Text>
            </View>

            <View style={{ height: 450, width: '100%' }}>
                <Canvas style={{ flex: 1 }}>
                    {/* Connections */}
                    <Group>
                        {SKILL_NODES.map((node, i) => {
                            if (i === 0) return null;
                            const parent = SKILL_NODES[0]; // Simple star topology for demo, ideally graph
                            // Linking logic simplistic for demo: connecting to closest "parent" or manual
                            const prevNode = SKILL_NODES[i - 1];
                            const target = i > 2 ? SKILL_NODES[i - 1] : SKILL_NODES[0];

                            return (
                                <Line
                                    key={`line-${i}`}
                                    p1={vec(target.x, target.y)}
                                    p2={vec(node.x, node.y)}
                                    color={node.unlocked ? getColor(true) : '#333'}
                                    strokeWidth={4}
                                    opacity={node.unlocked ? 0.8 : 0.3}
                                />
                            );
                        })}
                    </Group>

                    {/* Nodes */}
                    {SKILL_NODES.map((node) => (
                        <Group key={`node-${node.id}`}>
                            <Circle cx={node.x} cy={node.y} r={20} color={getColor(node.unlocked)} opacity={node.unlocked ? 1 : 0.5}>
                                {node.unlocked && <Paint style="stroke" strokeWidth={2} color="white" opacity={0.6} />}
                            </Circle>
                        </Group>
                    ))}
                </Canvas>

                {/* Interactive Overlays for Labels */}
                {SKILL_NODES.map((node) => (
                    <TouchableOpacity
                        key={`label-${node.id}`}
                        style={{ position: 'absolute', left: node.x - 40, top: node.y + 25, width: 80, alignItems: 'center' }}
                        activeOpacity={0.8}
                    >
                        <GlassPane className="px-2 py-1 rounded-md" intensity={20}>
                            <Text className={`text-[10px] font-bold ${node.unlocked ? 'text-white' : 'text-gray-600'}`}>
                                {node.title}
                            </Text>
                            <Text className="text-[8px] text-gray-500">Lvl {node.requiredLevel}</Text>
                        </GlassPane>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};
