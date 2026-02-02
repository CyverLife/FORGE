import { IconSymbol } from '@/components/ui/icon-symbol';
import { PortalView } from '@/components/ui/PortalView';
import { TotemView } from '@/components/ui/TotemView';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard() {
  const { level, xp, rank } = useGamification();
  const { user } = useAuth();

  // Extract name from email or metadata, fallback to 'INICIADO'
  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0]?.toUpperCase() || 'INICIADO';

  return (
    <SafeAreaView className="flex-1 bg-deep-black">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

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
            <View className="w-24 h-24 rounded-full bg-card-black border-4 border-forge-orange items-center justify-center mb-2 overflow-hidden">
              <Image
                source={user?.user_metadata?.avatar_url
                  ? { uri: user.user_metadata.avatar_url }
                  : require('@/assets/images/simio_angel_concept.png')
                }
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            </View>
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
          <View className="flex-row flex-wrap gap-3">
            {[
              { icon: 'flame.fill', color: '#F97316', value: '0', label: 'RACHA MÁXIMA', delay: 200 },
              { icon: 'calendar', color: '#3B82F6', value: '1', label: 'DÍAS ACTIVO', delay: 250 },
              { icon: 'checkmark.circle.fill', color: '#22C55E', value: '0', label: 'COMPLETADOS', delay: 300 },
              { icon: 'trophy.fill', color: '#EF4444', value: '0', label: 'LOGROS', delay: 350 },
            ].map((stat, i) => (
              <Animated.View
                key={i}
                entering={FadeInDown.delay(stat.delay).springify()}
                className="flex-1 min-w-[45%] bg-card-black p-3 border border-border-subtle rounded-card flex-row items-center gap-3"
              >
                <View className="p-2 rounded-card" style={{ backgroundColor: `${stat.color}10` }}>
                  <IconSymbol name={stat.icon as any} size={20} color={stat.color} />
                </View>
                <View>
                  <Text className="text-text-primary font-black text-xl font-display">{stat.value}</Text>
                  <Text className="text-text-tertiary text-[10px] font-bold uppercase tracking-wider">
                    {stat.label}
                  </Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* TOTEM VIEW - PROMINENTE */}
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

      </ScrollView>
    </SafeAreaView>
  );
}
