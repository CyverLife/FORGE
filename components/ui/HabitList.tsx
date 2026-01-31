import { useHabits } from '@/hooks/useHabits';
import { Habit } from '@/types';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { Text, View } from 'react-native';
import { GlassPane } from './GlassPane';

export const HabitList = () => {
    const { habits, loading } = useHabits();

    const renderItem = ({ item }: { item: Habit }) => (
        <GlassPane className="mb-3 p-4 rounded-xl flex-row justify-between items-center" opacity={0.03} blurAmount={5}>
            <View>
                <Text className="text-white font-bold text-lg">{item.title}</Text>
                <Text className="text-gray-500 text-xs">{item.attribute} • {item.difficulty} XP</Text>
            </View>
            <View className={`w-3 h-3 rounded-full ${item.attribute === 'FIRE' ? 'bg-orange-500' : 'bg-gray-500'}`} />
        </GlassPane>
    );

    if (loading && habits.length === 0) return <Text className="text-gray-500 text-center mt-4">Calibrating Protocols...</Text>;

    if (habits.length === 0) return (
        <View className="mt-4 p-4 items-center">
            <Text className="text-gray-600 mb-2">No active protocols.</Text>
        </View>
    );

    return (
        <View className="w-full mt-6 px-6 flex-1 h-full">
            <Text className="text-gray-400 font-bold mb-4 tracking-wider text-xs">TODAY'S OPERATIONS</Text>
            <View style={{ minHeight: 200, flex: 1 }}>
                <FlashList
                    data={habits}
                    renderItem={renderItem}
                    estimatedItemSize={70}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
};
