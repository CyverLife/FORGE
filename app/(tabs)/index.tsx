import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntiGravityEngine } from '@/components/skia/AntiGravityEngine';
import { GlassPane } from '@/components/ui/GlassPane';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { CrossroadsModal } from '@/components/ui/CrossroadsModal';
import { useDecisions } from '@/hooks/useDecisions';
import { useAuth } from '@/hooks/useAuth';
import { HabitList } from '@/components/ui/HabitList';
import { useGamification } from '@/hooks/useGamification';
import * as Haptics from 'expo-haptics';

export default function Dashboard() {
  const [modalVisible, setModalVisible] = useState(false);
  const { logDecision } = useDecisions();
  const { user } = useAuth();
  const { level, xp, antiGravityScore } = useGamification();

  const handleDecision = async (type: 'ANGEL' | 'APE') => {
    setModalVisible(false);
    await logDecision(type, 'Dashboard Quick Decision');

    if (type === 'ANGEL') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Ascension Initiated', '+10 Anti-Gravity Score');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Gravity Increased', 'Entropy Detected');
    }
  };

  const handleOpenModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-obsidian">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-400 font-medium tracking-wide">PROTOCOL ACTIVE</Text>
          <Text className="text-white text-2xl font-bold">Good Evening, {user?.email?.split('@')[0] || 'Initiate'}</Text>
        </View>
        <View className="items-end">
          <Text className="text-magma font-bold text-lg">LVL {level}</Text>
          <Text className="text-gray-500 text-xs">{xp} XP</Text>
        </View>
      </View>

      {/* Main Engine */}
      <View className="flex-1 items-center justify-center -mt-10">
        <AntiGravityEngine active={true} intensity={antiGravityScore / 100} />
      </View>

      {/* Glass Panel */}
      <View className="px-6 pb-4">
        <GlassPane style={{ borderRadius: 24, padding: 20 }} opacity={0.05} blurAmount={20}>
          <Text className="text-magma text-lg font-bold mb-2">GRAVITY SCORE: {antiGravityScore}</Text>
          <Text className="text-white opacity-80 mb-4">
            {antiGravityScore > 50 ? "System Stable. Orbit achiever." : "You are drifting. Execute protocol."}
          </Text>

          <TouchableOpacity
            className="bg-magma py-4 rounded-xl items-center shadow-lg shadow-magma/50"
            onPress={handleOpenModal}
          >
            <Text className="text-white font-bold text-lg tracking-widest">FORGE HABIT</Text>
          </TouchableOpacity>
        </GlassPane>
      </View>

      {/* Protocols List */}
      <HabitList />

      {/* Floating Action Button for Crossroads */}
      <TouchableOpacity
        className="absolute bottom-32 right-6 bg-magma w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-magma/50 border border-white/20 z-50"
        onPress={handleOpenModal}
      >
        <Text className="text-white font-bold text-2xl">+</Text>
      </TouchableOpacity>

      <CrossroadsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onDecision={handleDecision}
      />
    </SafeAreaView>
  );
}
