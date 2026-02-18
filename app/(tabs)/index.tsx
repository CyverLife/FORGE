import { CoherenceChart } from '@/components/ui/CoherenceChart';
import { GlassPane } from '@/components/ui/GlassPane';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PortalView } from '@/components/ui/PortalView';
import { StreakCounter } from '@/components/ui/StreakCounter';
import { TotemView } from '@/components/ui/TotemView';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { BADGES } from '@/constants/badges';
import { FRAMES } from '@/constants/frames';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { useHabits } from '@/hooks/useHabits';
import { useIsFocused } from '@react-navigation/native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Dashboard() {
  const { level, xp, rank, streak, antiGravityScore } = useGamification();
  const { habits } = useHabits();
  const { user } = useAuth();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  // Calculate stats
  const totalCompletions = React.useMemo(() => {
    const total = habits.reduce((acc, h) => {
      const completedCount = h.logs?.filter((l: any) => l.status === 'completed').length || 0;
      return acc + completedCount;
    }, 0);
    console.log('[DASHBOARD] Total Completions Calculated:', total, 'Habits Count:', habits.length);
    return total;
  }, [habits]);

  // Extract name from email or metadata, fallback to 'INICIADO'
  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0]?.toUpperCase() || 'INICIADO';

  // Get current frame
  const currentFrameId = user?.user_metadata?.frame_id || 'default';
  const currentFrame = FRAMES.find(f => f.id === currentFrameId);

  return (
    <View style={{ flex: 1, backgroundColor: '#09090b' }}>
      <GradientBackground>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <Animated.View
            key={isFocused ? 'focused' : 'unfocused'}
            entering={FadeInDown.duration(600).springify()}
            style={{ flex: 1, paddingTop: insets.top }}
          >

            {/* Premium Grid Background */}
            <View className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
              {Array.from({ length: 8 }).map((_, i) => (
                <View
                  key={`v-${i}`}
                  style={{
                    position: 'absolute',
                    left: `${(i + 1) * 12.5}%`,
                    top: 0,
                    bottom: 0,
                    width: 1,
                    backgroundColor: '#FFFFFF'
                  }}
                />
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <View
                  key={`h-${i}`}
                  style={{
                    position: 'absolute',
                    top: `${(i + 1) * 8.33}%`,
                    left: 0,
                    right: 0,
                    height: 1,
                    backgroundColor: '#FFFFFF'
                  }}
                />
              ))}
            </View>

            {/* Header - Staggered Entrance */}
            <Animated.View
              entering={FadeInDown.delay(0).springify()}
              className="pt-8 pb-6 px-4 border-b border-white/5 bg-black/20 backdrop-blur-md"
            >

              <View className="items-center mb-8 relative">
                <TouchableOpacity
                  onPress={() => router.push('/guide')}
                  className="absolute left-0 top-2 z-20 bg-white/5 p-2 rounded-full border border-white/10 active:bg-white/10"
                >
                  <IconSymbol name="book.fill" size={20} color="#A1A1A1" />
                </TouchableOpacity>

                <Image
                  source={require('@/assets/images/forge_logo_final.png')}
                  style={{ width: 140, height: 60 }}
                  contentFit="contain"
                />
              </View>

              {/* Avatar & Username */}
              <Animated.View
                entering={FadeInDown.delay(100).springify()}
                className="items-center mb-8"
              >
                <TouchableOpacity
                  onPress={() => router.navigate('/settings')}
                  activeOpacity={0.8}
                >
                  <View className="items-center justify-center mb-4">
                    <UserAvatar
                      url={user?.user_metadata?.avatar_url}
                      frame={currentFrame}
                      size={100}
                    />
                  </View>

                  <View className="absolute bottom-10 -right-1 bg-card-black rounded-full p-2 border border-border-subtle shadow-lg">
                    <IconSymbol name="pencil" size={12} color="white" />
                  </View>
                </TouchableOpacity>

                <Text className="text-text-primary font-black text-2xl tracking-wider font-display mb-1 text-center">
                  {displayName}
                </Text>

                {/* Level Display */}
                <Text className="text-molten-core font-bold text-xs tracking-widest font-label uppercase text-center mb-4">
                  NIVEL {level} • {level < 10 ? 'INICIADO' : level < 30 ? 'ADEPT' : 'MASTER'}
                </Text>

                <View className="flex-row items-center gap-2 mt-1 justify-center flex-wrap px-4">
                  {(user?.user_metadata?.selected_badges || []).map((badgeId: string, index: number) => {
                    const badge = BADGES.find(b => b.id === badgeId || b.id === badgeId.toLowerCase().replace(/ /g, '_'));
                    if (!badge || badge.type === 'RANK') return null;
                    return (
                      <Animated.View
                        key={`badge-${index}`}
                        entering={FadeInDown.springify().damping(18).stiffness(90).mass(1.2).delay(index * 50 + 300)}
                        className="bg-white/5 p-1.5 rounded-xl border border-white/10"
                      >
                        <Image
                          source={badge.image}
                          style={{ width: 32, height: 32 }}
                          contentFit="contain"
                          cachePolicy="memory-disk"
                          transition={200}
                        />
                      </Animated.View>
                    );
                  })}
                </View>

                <View className="items-center mt-4">
                  {rank && (
                    <Image
                      source={
                        rank === 'BRONZE' ? require('@/assets/images/rank_bronze.png') :
                          rank === 'SILVER' ? require('@/assets/images/rank_silver.png') :
                            rank === 'GOLD' ? require('@/assets/images/rank_gold.png') :
                              require('@/assets/images/rank_infinite.png')
                      }
                      style={{ width: 140, height: 44 }}
                      contentFit="contain"
                    />
                  )}
                </View>
              </Animated.View>

              {/* Level Progress Bar */}
              <Animated.View
                entering={FadeInDown.springify().damping(18).stiffness(90).mass(1.2).delay(400)}
                className="flex-col gap-2 mb-6 px-2"
              >
                <View className="flex-row justify-between items-end mb-0.5">
                  <Text className="text-text-tertiary text-[10px] font-bold font-label">XP PROGRESO</Text>
                  <Text className="text-text-primary text-[10px] font-bold font-display">{Math.floor(xp % 100)} / 100</Text>
                </View>
                <View className="w-full h-2.5 bg-card-black/50 overflow-hidden border border-white/5 rounded-full">
                  <LinearGradient
                    colors={['#FF3B00', '#FF9500']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ width: `${(xp % 100)}%`, height: '100%', borderRadius: 999 }}
                  />
                </View>
              </Animated.View>

              {/* Stats Grid - 4 components in 2x2 layout */}
              <View className="flex-row flex-wrap gap-2 mb-6 justify-between">

                <Animated.View entering={FadeInDown.springify().damping(18).stiffness(90).mass(1.2).delay(500)} style={{ flexBasis: '48%' }}>
                  <StreakCounter streak={streak} />
                </Animated.View>

                <Animated.View entering={FadeInDown.springify().damping(18).stiffness(90).mass(1.2).delay(550)} style={{ flexBasis: '48%' }}>
                  <GlassPane intensity={20} borderOpacity={0.05} style={{ borderRadius: 20, overflow: 'hidden', backgroundColor: 'rgba(24, 24, 27, 0.6)' }}>
                    <View className="p-3 flex-row items-center gap-3">
                      <View className="p-2 rounded-xl bg-blue-500/10">
                        <IconSymbol name="calendar" size={18} color="#3B82F6" />
                      </View>
                      <View>
                        <Text className="text-text-primary font-black text-xl font-display">{Math.floor(antiGravityScore / 10)}</Text>
                        <Text className="text-text-tertiary text-[9px] font-bold uppercase tracking-widest font-label">ESTADO</Text>
                      </View>
                    </View>
                  </GlassPane>
                </Animated.View>

                <Animated.View entering={FadeInDown.springify().damping(18).stiffness(90).mass(1.2).delay(600)} style={{ flexBasis: '48%' }}>
                  <GlassPane intensity={20} borderOpacity={0.05} style={{ borderRadius: 20, overflow: 'hidden', backgroundColor: 'rgba(24, 24, 27, 0.6)' }}>
                    <View className="p-3 flex-row items-center gap-3">
                      <View className="p-2 rounded-xl bg-green-500/10">
                        <IconSymbol name="checkmark.circle.fill" size={18} color="#22C55E" />
                      </View>
                      <View>
                        <Text className="text-text-primary font-black text-xl font-display">{totalCompletions || 0}</Text>
                        <Text className="text-text-tertiary text-[9px] font-bold uppercase tracking-widest font-label">HECHOS</Text>
                      </View>
                    </View>
                  </GlassPane>
                </Animated.View>

                <Animated.View entering={FadeInDown.springify().damping(18).stiffness(90).mass(1.2).delay(650)} style={{ flexBasis: '48%' }}>
                  <GlassPane intensity={20} borderOpacity={0.05} style={{ borderRadius: 20, overflow: 'hidden', backgroundColor: 'rgba(24, 24, 27, 0.6)' }}>
                    <View className="p-3 flex-row items-center gap-3">
                      <View className="p-2 rounded-xl bg-red-500/10">
                        <IconSymbol name="trophy.fill" size={18} color="#EF4444" />
                      </View>
                      <View>
                        <Text className="text-text-primary font-black text-xl font-display">{level - 1}</Text>
                        <Text className="text-text-tertiary text-[9px] font-bold uppercase tracking-widest font-label">LOGROS</Text>
                      </View>
                    </View>
                  </GlassPane>
                </Animated.View>

              </View>

              <Animated.View entering={FadeInDown.springify().damping(18).stiffness(90).mass(1.2).delay(700)}>
                <CoherenceChart />
              </Animated.View>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.springify().damping(18).stiffness(90).mass(1.2).delay(800)}
              className="py-8 px-4"
            >
              <Text className="text-text-primary font-black text-xl uppercase tracking-[0.2em] font-display text-center mb-6 opacity-90">
                TU TOTEM
              </Text>
              <TotemView />
              <Text className="text-text-tertiary text-center mt-6 text-xs font-label tracking-widest">
                {level < 10 ? 'FASE 1: ROCA SIN CINCELAR' : level < 30 ? 'FASE 2: PIEDRA TALLADA' : 'FASE 3: MONUMENTO FORJADO'}
              </Text>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.springify().damping(18).stiffness(90).mass(1.2).delay(450)}
              className="py-8 px-4 bg-card-black/40 border-y border-white/5 backdrop-blur-sm"
            >
              <Text className="text-text-primary font-black text-xl uppercase tracking-[0.2em] font-display text-center mb-8 opacity-90">
                ESTADO DEL PORTAL
              </Text>
              <PortalView />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.springify().damping(18).stiffness(90).mass(1.2).delay(450)}
              className="px-6 py-8"
            >
              <TouchableOpacity
                className="bg-molten-core p-5 rounded-2xl active:scale-95 shadow-lg shadow-molten-core/20"
                style={{
                  shadowColor: '#FF3B00',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 5
                }}
                onPress={() => router.push('/habits')}
              >
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-white font-black text-lg uppercase tracking-wider font-display">
                      GESTIONAR PROTOCOLO
                    </Text>
                    <Text className="text-white/80 text-xs mt-1 font-label tracking-wide">
                      Acceder al panel de hábitos
                    </Text>
                  </View>
                  <View className="bg-white/20 p-2 rounded-full">
                    <IconSymbol name="chevron.right" size={20} color="white" />
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>

            <View className="h-24" />

          </Animated.View>
        </ScrollView>
      </GradientBackground>
    </View>
  );
}
