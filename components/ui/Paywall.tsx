import { AntiGravityEngine } from '@/components/skia/AntiGravityEngine';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button } from './Button';
import { GlassPane } from './GlassPane';

interface PaywallProps {
    visible: boolean;
    onClose: () => void;
    onPurchase: () => void;
}

import { useRevenueCat } from '@/hooks/useRevenueCat';

export const Paywall = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    const { currentOffering, purchasePro, restorePurchases, loading } = useRevenueCat();

    const price = currentOffering?.product.priceString || "$4.99";

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
                        <Text className="text-white text-3xl font-bold">{price}<Text className="text-base font-normal text-gray-400">/mo</Text></Text>
                        <Text className="text-gray-400 text-sm mt-2">7-Day Free Trial. Cancel anytime.</Text>
                    </GlassPane>

                    <Button
                        title={loading ? "Processing..." : "Start Free Trial"}
                        onPress={purchasePro}
                        className="mb-4"
                        disabled={loading}
                    />
                    <Button
                        title="Restore Purchases"
                        variant="outline"
                        onPress={restorePurchases}
                        className="mb-4 text-xs"
                        disabled={loading}
                    />

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
