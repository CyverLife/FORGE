import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AnimatedBackground>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#F97316',
          tabBarInactiveTintColor: '#6B7280',
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: '#0E0E0E',
            borderTopWidth: 1,
            borderTopColor: '#2A2A2A',
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'HOME',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="habits"
          options={{
            title: 'HÁBITOS',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="list.bullet" color={color} />,
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'ESTADÍSTICAS',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="chart.bar.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: 'RANKING',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="trophy.fill" color={color} />,
          }}
        />
      </Tabs>
    </AnimatedBackground>
  );
}
