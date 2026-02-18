import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGamification } from '@/hooks/useGamification';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Leaderboard } from '../gamification/Leaderboard';
import { SkillTree } from '../gamification/SkillTree';
import { GlassPane } from './GlassPane';
import { Moodboard } from './Moodboard';

interface StatsModalProps {
    visible: boolean;
    onClose: () => void;
}

type Tab = 'OVERVIEW' | 'SKILLS' | 'ASCENSION' | 'VISION';

// ... (imports remain)

export const StatsModal = ({ visible, onClose }: StatsModalProps) => {
    const { level, xp, antiGravityScore } = useGamification();
    const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');

    const renderContent = () => {
        switch (activeTab) {
            case 'SKILLS':
                return <SkillTree />;
            case 'ASCENSION':
                return <Leaderboard />;
            case 'VISION':
                return <Moodboard />;
            case 'OVERVIEW':
            default:
                return (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Main Level Card */}
                        <View className="items-center mb-8">
                            <View className="w-32 h-32 rounded-full bg-molten-core/20 justify-center items-center border-4 border-molten-core/50 mb-4 shadow-lg shadow-molten-core/50">
                                <Text className="text-molten-core text-5xl font-black">{level}</Text>
                                <Text className="text-molten-core/80 text-xs font-bold tracking-widest uppercase">Level</Text>
                            </View>
                            <Text className="text-white/60 text-sm font-medium tracking-wide">EXP: {xp} / {level * 100}</Text>
                            <View className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
                                <View className="h-full bg-molten-core" style={{ width: `${(xp % (level * 100)) / level}%` }} />
                            </View>
                        </View>

                        {/* AntiGravity Status */}
                        <GlassPane className="mb-4 p-4 rounded-xl border border-white/5" intensity={20}>
                            <View className="flex-row items-center mb-2">
                                <IconSymbol name="waveform.path.ecg" size={20} color="#10B981" />
                                <Text className="text-white font-bold ml-2 text-lg">Anti-Gravity Score</Text>
                            </View>
                            <Text className="text-4xl font-black text-white mb-1">{antiGravityScore}</Text>
                            <Text className="text-gray-400 text-xs">
                                Higher score indicates resistance to entropy based on Angel/Ape decisions.
                            </Text>
                        </GlassPane>

                        {/* Badges / Achievements Placeholder */}
                        <View className="flex-row flex-wrap justify-between mt-2">
                            <View className="w-[48%] bg-white/5 p-4 rounded-xl mb-4 border border-white/5 items-center">
                                <IconSymbol name="flame.fill" size={32} color={xp > 100 ? "#F97316" : "#555"} />
                                <Text className="text-white font-bold mt-2">Ignition</Text>
                                <Text className="text-gray-500 text-[10px] text-center">Reach 100 XP</Text>
                            </View>
                            <View className="w-[48%] bg-white/5 p-4 rounded-xl mb-4 border border-white/5 items-center">
                                <IconSymbol name="shield.fill" size={32} color={antiGravityScore > 80 ? "#3B82F6" : "#555"} />
                                <Text className="text-white font-bold mt-2">Guardian</Text>
                                <Text className="text-gray-500 text-[10px] text-center">80+ AG Score</Text>
                            </View>
                            <View className="w-[48%] bg-white/5 p-4 rounded-xl mb-4 border border-white/5 items-center">
                                <IconSymbol name="bolt.fill" size={32} color={level >= 5 ? "#EAB308" : "#555"} />
                                <Text className="text-white font-bold mt-2">Veteran</Text>
                                <Text className="text-gray-500 text-[10px] text-center">Reach Level 5</Text>
                            </View>
                            <View className="w-[48%] bg-white/5 p-4 rounded-xl mb-4 border border-white/5 items-center">
                                <IconSymbol name="star.fill" size={32} color="#555" />
                                <Text className="text-white font-bold mt-2">Legend</Text>
                                <Text className="text-gray-500 text-[10px] text-center">Coming Soon</Text>
                            </View>
                        </View>
                    </ScrollView>
                );
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/90 justify-center items-center px-4">
                <GlassPane className="w-full h-[90%] rounded-3xl overflow-hidden" intensity={30}>
                    <View className="flex-1 p-4">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-white text-xl font-bold tracking-tight">COCKPIT</Text>
                            <TouchableOpacity onPress={onClose} className="bg-white/10 p-2 rounded-full">
                                <IconSymbol name="xmark" size={20} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Tabs */}
                        <View className="flex-row mb-6 bg-white/5 p-1 rounded-xl">
                            {(['OVERVIEW', 'SKILLS', 'ASCENSION', 'VISION'] as Tab[]).map((tab) => (
                                <TouchableOpacity
                                    key={tab}
                                    onPress={() => setActiveTab(tab)}
                                    className={`flex-1 py-2 items-center rounded-lg ${activeTab === tab ? 'bg-molten-core/20' : ''}`}
                                >
                                    <Text className={`text-[10px] font-bold ${activeTab === tab ? 'text-molten-core' : 'text-gray-500'}`}>
                                        {tab}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Content Area */}
                        <View className="flex-1">
                            {renderContent()}
                        </View>
                    </View>
                </GlassPane>
            </View>
        </Modal>
    );
};
