import { AntiGravityEngine } from '@/components/skia/AntiGravityEngine';
import { CrossroadsModal } from '@/components/ui/CrossroadsModal';
import { GlassPane } from '@/components/ui/GlassPane';
import { HabitList } from '@/components/ui/HabitList';
import { useAuth } from '@/hooks/useAuth';
import { useDecisions } from '@/hooks/useDecisions';
import { useGamification } from '@/hooks/useGamification';
import { Canvas, Fill } from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        <View className="flex-1">
          <Text className="text-gray-400 font-medium tracking-widest text-[10px]">PROTOCOL ACTIVE • SYSTEM NOMINAL</Text>
          <Text className="text-white text-2xl font-bold tracking-tight">Good Evening, {user?.email?.split('@')[0] || 'Initiate'}</Text>
        </View>
        <View className="items-end">
          <View className="flex-row items-baseline">
            <Text className="text-magma font-black text-2xl">L{level}</Text>
            <Text className="text-gray-500 text-xs ml-1">/99</Text>
          </View>
          <View className="w-20 h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
            <View
              className="h-full bg-magma"
              style={{ width: `${Math.max(5, (xp % 100))}%` }}
            />
          </View>
        </View>
      </View>

      {/* Main Engine */}
      <View className="flex-1 items-center justify-center -mt-10">
        <AntiGravityEngine active={true} intensity={antiGravityScore / 100} />
      </View>

      {/* Glass Panel */}
      <View className="px-6 pb-4">
        <GlassPane style={{ borderRadius: 24, padding: 20 }} opacity={0.05} blurAmount={20}>
          <View className="flex-row justify-between items-start mb-2">
            <View>
              <Text className="text-magma text-lg font-black tracking-tight">GRAVITY SCORE: {antiGravityScore}</Text>
              <Text className="text-white/60 text-xs mb-4">
                {antiGravityScore > 50 ? "System Stable. Orbit achieved." : "You are drifting. Execute protocol."}
              </Text>
            </View>
            {/* Sparkline simulation */}
            <View className="w-16 h-8 opacity-50">
              <Canvas style={{ flex: 1 }}>
                {/* Just a decorative line */}
                <Fill color="transparent" />
              </Canvas>
            </View>
          </View>

          <TouchableOpacity
            className="bg-magma py-4 rounded-xl items-center shadow-lg shadow-magma/50 active:scale-95 transition-all"
            onPress={handleOpenModal}
          >
            <Text className="text-white font-black text-lg tracking-widest">FORGE HABIT</Text>
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
