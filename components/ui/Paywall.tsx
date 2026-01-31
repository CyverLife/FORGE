import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { GlassPane } from './GlassPane';
import { Button } from './Button';
import { AntiGravityEngine } from '@/components/skia/AntiGravityEngine';

interface PaywallProps {
    visible: boolean;
    onClose: () => void;
    onPurchase: () => void;
}

export const Paywall = ({ visible, onClose, onPurchase }: PaywallProps) => {
    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View className="flex-1 bg-obsidian">
                {/* Decoration */}
                <View className="absolute top-0 w-full h-1/2 opacity-30">
                    <AntiGravityEngine active={true} intensity={0.8} />
                </View>

                <ScrollView className="flex-1 px-6 pt-12">
                    <Text className="text-magma text-center text-sm font-bold tracking-[6px] mb-4">THE FORGEMASTER</Text>
                    <Text className="text-white text-center text-4xl font-bold mb-8">Unlock Your Potential</Text>

                    <View className="space-y-4 mb-8">
                        <FeatureItem title="Unlimited Protocols" description="Forge as many habits as you need." />
                        <FeatureItem title="Full Skill Trees" description="Access advanced habit progression." />
                        <FeatureItem title="Infinite History" description="Analyze your data from day one." />
                        <FeatureItem title="Exclusive Themes" description="Neon Blue, Cyberpunk Yellow, Pure White." />
                    </View>

                    <GlassPane className="p-6 rounded-2xl items-center mb-8" opacity={0.1}>
                        <Text className="text-white text-3xl font-bold">$4.99<Text className="text-base font-normal text-gray-400">/mo</Text></Text>
                        <Text className="text-gray-400 text-sm mt-2">7-Day Free Trial. Cancel anytime.</Text>
                    </GlassPane>

                    <Button title="Start Free Trial" onPress={onPurchase} className="mb-4" />
                    <Button title="Restore Purchases" variant="outline" onPress={() => { }} className="mb-4 text-xs" />

                    <TouchableOpacity onPress={onClose} className="py-4">
                        <Text className="text-gray-500 text-center font-bold">NO, I CHOOSE MEDIOCRITY</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Modal>
    );
};

const FeatureItem = ({ title, description }: { title: string, description: string }) => (
    <GlassPane className="p-4 rounded-xl flex-row items-center" opacity={0.05} blurAmount={5}>
        <View className="w-8 h-8 rounded-full bg-magma/20 items-center justify-center mr-4">
            <Text className="text-magma font-bold">✓</Text>
        </View>
        <View className="flex-1">
            <Text className="text-white font-bold">{title}</Text>
            <Text className="text-gray-500 text-xs">{description}</Text>
        </View>
    </GlassPane>
);
