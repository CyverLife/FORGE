import { CreateHabitModal } from '@/components/ui/CreateHabitModal';
import { HabitList } from '@/components/ui/HabitList';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HabitsScreen() {
    const [modalVisible, setModalVisible] = React.useState(false);
    const insets = useSafeAreaInsets();

    return (
        <View style={{ flex: 1, backgroundColor: '#09090B', paddingTop: insets.top }}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                {/* Header */}
                <Animated.View
                    entering={FadeInDown.delay(0).springify()}
                    className="pt-12 pb-6 px-4 border-b border-border-subtle"
                >
                    <View className="flex-row items-center gap-3 mb-2">
                        <IconSymbol name="list.bullet" size={28} color="#F97316" />
                        <Text className="text-text-primary font-black text-3xl uppercase tracking-wider font-display">
                            PROTOCOLOS
                        </Text>
                    </View>
                    <Text className="text-text-secondary text-sm">
                        Gestiona tus hábitos diarios
                    </Text>
                </Animated.View>

                {/* Habit List */}
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <HabitList />
                </Animated.View>

                <View className="h-32" />

            </ScrollView>

            {/* FAB - Create New Protocol */}
            <TouchableOpacity
                className="absolute bottom-24 right-6 w-16 h-16 bg-forge-orange items-center justify-center rounded-full shadow-2xl active:scale-95"
                style={{ elevation: 8, shadowColor: '#F97316', shadowOpacity: 0.5, shadowRadius: 12 }}
                onPress={() => setModalVisible(true)}
            >
                <IconSymbol name="plus" size={28} color="#0E0E0E" />
            </TouchableOpacity>

            <CreateHabitModal visible={modalVisible} onClose={() => setModalVisible(false)} />
        </View>
    );
}
