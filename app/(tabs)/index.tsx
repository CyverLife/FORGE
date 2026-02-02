import { CoherenceChart } from '@/components/ui/CoherenceChart';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PortalView } from '@/components/ui/PortalView';
import { SkiaGlassPane } from '@/components/ui/SkiaGlassPane';
import { TotemView } from '@/components/ui/TotemView';
import { FRAMES } from '@/constants/frames';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';


import { useIsFocused } from '@react-navigation/native';

export default function Dashboard() {
  const { level, xp, rank } = useGamification();
  const { user } = useAuth();
  const isFocused = useIsFocused();

  // Extract name from email or metadata, fallback to 'INICIADO'
  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0]?.toUpperCase() || 'INICIADO';

  // Get current frame
  const currentFrameId = user?.user_metadata?.frame_id || 'default';
  const currentFrame = FRAMES.find(f => f.id === currentFrameId);

  return (
    <SafeAreaView className="flex-1 bg-deep-black">
      <GradientBackground>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Animated.View
            key={isFocused ? 'focused' : 'unfocused'}
            entering={FadeInDown.duration(600).springify()}
            style={{ flex: 1 }}
          >

            {/* Minimalist Grid Background */}
            <View className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {Array.from({ length: 8 }).map((_, i) => (
                <View
                  key={`v-${i}`}
                  style={{
                    position: 'absolute',
                    left: `${(i + 1) * 12.5}%`,
                    top: 0,
                    bottom: 0,
                    width: 1,
                    backgroundColor: 'rgba(255,255,255,0.03)'
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
                    backgroundColor: 'rgba(255,255,255,0.03)'
                  }}
                />
              ))}
            </View>

            {/* Header - Staggered Entrance */}
            <Animated.View
              entering={FadeInDown.delay(0).springify()}
              className="pt-12 pb-6 px-4 border-b border-border-subtle"
            >

              {/* Logo - Concept */}
              <View className="items-center mb-6">
                <Image
                  source={require('@/assets/images/forge_logo_final.png')}
                  style={{ width: 180, height: 80 }}
                  contentFit="contain"
                />
              </View>

              {/* ... Top Row code unchanged ... */}

              {/* Avatar & Username */}
              <Animated.View
                entering={FadeInDown.delay(100).springify()}
                className="items-center mb-6"
              >
                <TouchableOpacity
                  onPress={() => router.navigate('/settings')}
                  activeOpacity={0.8}
                >
                  <View className="w-24 h-24 bg-card-black items-center justify-center mb-2 relative">
                    <Image
                      source={user?.user_metadata?.avatar_url
                        ? { uri: user.user_metadata.avatar_url }
                        : require('@/assets/images/simio_angel_concept.png')
                      }
                      style={{ width: '90%', height: '90%' }}
                      contentFit="cover"
                    />

                    {/* Frame Overlay */}
                    {currentFrame?.image && (
                      <Image
                        source={currentFrame.image}
                        style={{ position: 'absolute', top: '-7.5%', left: '-7.5%', width: '115%', height: '115%', zIndex: 10 }}
                        contentFit="contain"
                      />
                    )}
                  </View>

                  {/* Edit Badge */}
                  <View className="absolute bottom-10 -right-2 bg-card-black/80 rounded-full p-1 border border-white/20">
                    <IconSymbol name="pencil" size={12} color="white" />
                  </View>
                </TouchableOpacity>

                <Text className="text-text-primary font-black text-xl tracking-widest font-display mb-2">
                  {displayName}
                </Text>

                {/* Rank Badge - Concept */}
                <View className="items-center">
                  {rank === 'BRONZE' && <Image source={require('@/assets/images/rank_bronze.png')} style={{ width: 120, height: 40 }} contentFit="contain" />}
                  {rank === 'SILVER' && <Image source={require('@/assets/images/rank_silver.png')} style={{ width: 120, height: 40 }} contentFit="contain" />}
                  {rank === 'GOLD' && <Image source={require('@/assets/images/rank_gold.png')} style={{ width: 120, height: 40 }} contentFit="contain" />}
                  {rank === 'INFINITE' && <Image source={require('@/assets/images/rank_infinite.png')} style={{ width: 120, height: 40 }} contentFit="contain" />}
                </View>
              </Animated.View>

              {/* Level Progress Bar */}
              <Animated.View
                entering={FadeInDown.delay(150).springify()}
                className="flex-row items-center gap-3 mb-6"
              >
                <Text className="text-text-primary text-3xl font-black italic font-display">
                  {level}
                </Text>
                <View className="flex-1 h-5 bg-card-black overflow-hidden border border-border-subtle relative justify-center rounded-premium">
                  <LinearGradient
                    colors={['#EF4444', '#F97316']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ width: `${(xp % 100)}%`, height: '100%' }}
                  />
                  <Text className="absolute self-center text-[10px] font-bold text-white/80 z-10 w-full text-center">
                    {Math.floor(xp % 100)} / 100 XP
                  </Text>
                </View>
              </Animated.View>

              {/* Stats Grid - Staggered */}
              <View className="flex-row flex-wrap gap-3 mb-6">
                <Animated.View entering={FadeInDown.delay(200).springify()} className="flex-1 min-w-[45%]">
                  <SkiaGlassPane height={undefined} cornerRadius={16} backgroundColor="rgba(20, 20, 23, 0.5)" borderColor="rgba(255, 255, 255, 0.08)">
                    <View className="p-3 flex-row items-center gap-3">
                      <View className="p-2 rounded-lg" style={{ backgroundColor: '#F9731615' }}>
                        <IconSymbol name="flame.fill" size={20} color="#F97316" />
                      </View>
                      <View>
                        <Text className="text-text-primary font-black text-xl font-display">0</Text>
                        <Text className="text-text-tertiary text-[10px] font-bold uppercase tracking-wider font-label">RACHA MÁXIMA</Text>
                      </View>
                    </View>
                  </SkiaGlassPane>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(250).springify()} className="flex-1 min-w-[45%]">
                  <SkiaGlassPane height={undefined} cornerRadius={16} backgroundColor="rgba(20, 20, 23, 0.5)" borderColor="rgba(255, 255, 255, 0.08)">
                    <View className="p-3 flex-row items-center gap-3">
                      <View className="p-2 rounded-lg" style={{ backgroundColor: '#3B82F615' }}>
                        <IconSymbol name="calendar" size={20} color="#3B82F6" />
                      </View>
                      <View>
                        <Text className="text-text-primary font-black text-xl font-display">1</Text>
                        <Text className="text-text-tertiary text-[10px] font-bold uppercase tracking-wider font-label">DÍAS ACTIVO</Text>
                      </View>
                    </View>
                  </SkiaGlassPane>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).springify()} className="flex-1 min-w-[45%]">
                  <SkiaGlassPane height={undefined} cornerRadius={16} backgroundColor="rgba(20, 20, 23, 0.5)" borderColor="rgba(255, 255, 255, 0.08)">
                    <View className="p-3 flex-row items-center gap-3">
                      <View className="p-2 rounded-lg" style={{ backgroundColor: '#22C55E15' }}>
                        <IconSymbol name="checkmark.circle.fill" size={20} color="#22C55E" />
                      </View>
                      <View>
                        <Text className="text-text-primary font-black text-xl font-display">0</Text>
                        <Text className="text-text-tertiary text-[10px] font-bold uppercase tracking-wider font-label">COMPLETADOS</Text>
                      </View>
                    </View>
                  </SkiaGlassPane>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(350).springify()} className="flex-1 min-w-[45%]">
                  <SkiaGlassPane height={undefined} cornerRadius={16} backgroundColor="rgba(20, 20, 23, 0.5)" borderColor="rgba(255, 255, 255, 0.08)">
                    <View className="p-3 flex-row items-center gap-3">
                      <View className="p-2 rounded-lg" style={{ backgroundColor: '#EF444415' }}>
                        <IconSymbol name="trophy.fill" size={20} color="#EF4444" />
                      </View>
                      <View>
                        <Text className="text-text-primary font-black text-xl font-display">0</Text>
                        <Text className="text-text-tertiary text-[10px] font-bold uppercase tracking-wider font-label">LOGROS</Text>
                      </View>
                    </View>
                  </SkiaGlassPane>
                </Animated.View>

                <Animated.View
                  entering={FadeInDown.delay(200).springify()}
                  className="flex-1 min-w-[45%]"
                >
                  <SkiaGlassPane
                    height={undefined}
                    cornerRadius={16}
                    backgroundColor="rgba(20, 20, 23, 0.5)"
                    borderColor="rgba(255, 255, 255, 0.08)"
                  >
                    <View className="p-3 flex-row items-center gap-3">
                      <View className="p-2 rounded-lg" style={{ backgroundColor: '#8B5CF615' }}>
                        <IconSymbol name="star.fill" size={20} color="#8B5CF6" />
                      </View>
                      <View>
                        <Text className="text-white text-5xl font-black font-display mb-2">{level}</Text>
                        <Text className="text-text-secondary text-xs uppercase tracking-widest font-label">Level</Text>
                      </View>
                    </View>
                  </SkiaGlassPane>
                </Animated.View>
              </View>

              <CoherenceChart />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(400).springify()}
              className="py-8 px-4"
            >
              <Text className="text-text-primary font-black text-2xl uppercase tracking-wider font-display text-center mb-4">
                TU TOTEM
              </Text>
              <TotemView />
              <Text className="text-text-secondary text-center mt-4 text-sm">
                Nivel {level} - {level < 10 ? 'TOTEM 1: Roca sin cincelar' : level < 30 ? 'TOTEM 2: Piedra tallada' : 'TOTEM 3: Monumento forjado'}
              </Text>
            </Animated.View>

            {/* PORTAL VIEW - ESTADO DE CONSCIENCIA */}
            <Animated.View
              entering={FadeInDown.delay(450).springify()}
              className="py-6 px-4 bg-card-black/30 border-y border-border-subtle"
            >
              <Text className="text-text-primary font-black text-2xl uppercase tracking-wider font-display text-center mb-6">
                ESTADO DEL PORTAL
              </Text>
              <PortalView />
            </Animated.View>

            {/* Action Button - Premium CTA */}
            <Animated.View
              entering={FadeInDown.delay(450).springify()}
              className="px-4 py-4"
            >
              <TouchableOpacity
                className="bg-card-black border border-border-subtle p-4 rounded-premium active:scale-97"
                onPress={() => router.push('/habits')}
              >
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-text-primary font-bold text-base uppercase tracking-wider">
                      VER MIS PROTOCOLOS
                    </Text>
                    <Text className="text-text-tertiary text-xs mt-1">
                      Gestiona tus hábitos diarios
                    </Text>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color="#A1A1A1" />
                </View>
              </TouchableOpacity>
            </Animated.View>

            <View className="h-24" />

          </Animated.View>
        </ScrollView>
      </GradientBackground>
    </SafeAreaView >
  );
}
