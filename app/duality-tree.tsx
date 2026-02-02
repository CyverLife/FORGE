import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGamification } from '@/hooks/useGamification';
import { useSkillTree } from '@/hooks/useSkillTree';
import { SkillNode } from '@/types';
import { Canvas, Line, vec } from '@shopify/react-native-skia';
import { BlurView } from 'expo-blur';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Modal, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function DualityTreeScreen() {
    const router = useRouter();
    const { nodes, unlockNode } = useSkillTree();
    const { xp } = useGamification();
    const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

    // Filter connections (Lines)
    const connections = nodes.flatMap(node =>
        node.required_nodes.map(parentId => {
            const parent = nodes.find(n => n.id === parentId);
            return parent ? { start: parent, end: node } : null;
        }).filter(Boolean)
    );

    const getNodeColor = (status: string, branch: string) => {
        if (status === 'LOCKED') return '#333';
        if (branch === 'ANGEL') return '#F59E0B'; // Gold/Light
        if (branch === 'APE') return '#C21F1F'; // Red/Blood
        return '#FFF'; // Core
    };

    return (
        <View className="flex-1 bg-[#0E0E0E]">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Background Grid Effect */}
            <View style={{ position: 'absolute', width, height, opacity: 0.1 }}>
                {/* Vertical Lines */}
                <View className="flex-row justify-around h-full">
                    {[...Array(5)].map((_, i) => <View key={i} className="w-[1px] bg-white/20" />)}
                </View>
                {/* Horizontal Lines */}
                <View className="absolute top-0 left-0 w-full h-full justify-around">
                    {[...Array(8)].map((_, i) => <View key={i} className="h-[1px] bg-white/20" />)}
                </View>
            </View>

            {/* Header - Heroes Academy Style */}
            <View className="pt-16 px-6 pb-6 flex-row justify-between items-start z-10">
                <TouchableOpacity onPress={() => router.back()} className="mt-2 bg-black/40 p-2 rounded border border-white/10 backdrop-blur-sm">
                    <IconSymbol name="chevron.left" size={24} color="#FFF" />
                </TouchableOpacity>
                <View className="items-end">
                    <Text className="text-white text-4xl font-black tracking-tighter uppercase leading-none text-right">DUALITY</Text>
                    <Text className="text-white/50 text-4xl font-black tracking-tighter uppercase leading-none text-right">STRUCTURE</Text>
                    <View className="flex-row items-center gap-2 mt-2">
                        <View className="h-1 w-12 bg-magma rounded-full" />
                        <Text className="text-magma text-xs font-mono font-bold tracking-widest">XP DISPONIBLE: {xp}</Text>
                    </View>
                </View>
            </View>

            {/* The Tree Canvas (Background Veins) */}
            <View style={{ flex: 1 }}>
                <Canvas style={{ position: 'absolute', width: width, height: height }}>
                    {connections.map((conn, i) => {
                        if (!conn) return null;
                        const startX = conn.start.x * width;
                        const startY = conn.start.y * height;
                        const endX = conn.end.x * width;
                        const endY = conn.end.y * height;
                        const isActive = conn.start.status !== 'LOCKED';

                        return (
                            <React.Fragment key={i}>
                                {/* Glow Effect for active lines */}
                                {isActive && (
                                    <Line
                                        p1={vec(startX, startY)}
                                        p2={vec(endX, endY)}
                                        color={getNodeColor(conn.start.status, conn.start.branch)}
                                        strokeWidth={4}
                                        opacity={0.3}
                                    />
                                )}
                                <Line
                                    p1={vec(startX, startY)}
                                    p2={vec(endX, endY)}
                                    color={isActive ? getNodeColor(conn.start.status, conn.start.branch) : '#1a1a1a'}
                                    strokeWidth={isActive ? 2 : 1}
                                />
                            </React.Fragment>
                        );
                    })}
                </Canvas>

                {/* Nodes (Interactive) */}
                {nodes.map(node => {
                    const statusColor = getNodeColor(node.status, node.branch);
                    const isUnlocked = node.status !== 'LOCKED';

                    return (
                        <TouchableOpacity
                            key={node.id}
                            style={{
                                position: 'absolute',
                                left: node.x * width - 28, // Center 56px
                                top: node.y * height - 28,
                                width: 56,
                                height: 56,
                                borderRadius: 0, // Hard industrial edge
                                backgroundColor: isUnlocked ? '#0E0E0E' : '#050505',
                                borderWidth: isUnlocked ? 2 : 1,
                                borderColor: statusColor,
                                alignItems: 'center',
                                justifyContent: 'center',
                                transform: [{ rotate: '45deg' }],
                                shadowColor: statusColor,
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: node.status === 'UNLOCKED' ? 0.6 : 0,
                                shadowRadius: 15,
                                elevation: isUnlocked ? 10 : 0
                            }}
                            onPress={() => setSelectedNode(node)}
                        >
                            <View style={{ transform: [{ rotate: '-45deg' }] }}>
                                <IconSymbol
                                    name={node.status === 'LOCKED' ? 'lock.fill' : 'circle.fill'} // Using basic shape to mimic "Gem"
                                    size={16}
                                    color={statusColor}
                                />
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Node Detail Modal - Heroes Academy Style */}
            <Modal visible={!!selectedNode} transparent animationType="slide">
                <View className="flex-1 bg-black/80 justify-end">
                    <BlurView intensity={50} tint="dark" style={{ position: 'absolute', width: '100%', height: '100%' }} />

                    <View className="bg-[#121212] p-8 border-t-2 border-white/20 h-[55%] rounded-t-[32px]">
                        {selectedNode && (
                            <>
                                {/* Handle bar */}
                                <View className="self-center w-12 h-1 bg-white/20 rounded-full mb-8" />

                                <View className="flex-row justify-between items-start mb-6">
                                    <View>
                                        <Text className="text-gray-500 font-mono font-bold tracking-[0.2em] text-[10px] uppercase mb-1">{selectedNode.branch} BRANCH</Text>
                                        <Text className="text-white text-4xl font-black uppercase tracking-tighter leading-none shadow-md shadow-black">{selectedNode.title}</Text>
                                    </View>
                                    <View className="bg-white/5 border border-white/10 px-3 py-2 rounded">
                                        <Text className="text-magma font-mono font-bold text-xs">{selectedNode.cost} XP</Text>
                                    </View>
                                </View>

                                <Text className="text-gray-300 text-lg font-medium mb-8 leading-7 pl-4 border-l-2 border-white/10">{selectedNode.description}</Text>

                                {selectedNode.conflicts_with.length > 0 && (
                                    <View className="mb-8 border border-red-900/50 bg-red-950/20 p-4 rounded">
                                        <View className="flex-row items-center gap-2 mb-1">
                                            <IconSymbol name="exclamationmark.triangle.fill" size={14} color="#EF4444" />
                                            <Text className="text-red-500 font-bold uppercase text-[10px] tracking-widest">PUNTO DE NO RETORNO</Text>
                                        </View>
                                        <Text className="text-red-400/80 text-xs">Esta elección bloqueará caminos opuestos.</Text>
                                    </View>
                                )}

                                <View className="flex-1 justify-end gap-3">
                                    <TouchableOpacity
                                        className={`h-14 items-center justify-center border-2 ${selectedNode.status === 'LOCKED' || selectedNode.cost > xp ? 'border-white/10 bg-white/5' : 'bg-white border-white'}`}
                                        disabled={selectedNode.status === 'LOCKED' || selectedNode.cost > xp}
                                        onPress={() => {
                                            unlockNode(selectedNode.id);
                                            setSelectedNode(null);
                                        }}
                                        style={{ shadowColor: '#FFF', shadowOpacity: selectedNode.status === 'UNLOCKED' ? 0.3 : 0, shadowRadius: 20 }}
                                    >
                                        <Text className={`font-black text-base tracking-[0.2em] uppercase ${selectedNode.status === 'LOCKED' || selectedNode.cost > xp ? 'text-gray-600' : 'text-black'}`}>
                                            {selectedNode.status === 'UNLOCKED' || selectedNode.status === 'MASTERED' ? 'DOMINADO' : 'FORJAR PROTOCOLO'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        className="h-14 items-center justify-center border border-white/10 active:bg-white/5"
                                        onPress={() => setSelectedNode(null)}
                                    >
                                        <Text className="text-white/60 text-xs font-bold tracking-widest uppercase">CANCELAR</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}
