import { Oswald_700Bold, useFonts as useOswald } from '@expo-google-fonts/oswald';
import { PlayfairDisplay_700Bold, useFonts as usePlayfair } from '@expo-google-fonts/playfair-display';
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import '../global.css';

import { GlobalAlertProvider } from '@/context/GlobalAlertContext';
import { HabitsProvider } from '@/context/HabitsContext';
import { SquadsProvider } from '@/context/SquadsContext';
import { ToastProvider } from '@/context/ToastContext';
import { useAuth } from '@/hooks/useAuth';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { session, loading: authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded] = useOswald({
    Oswald_700Bold,
  });
  const [playfairLoaded] = usePlayfair({
    PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    if (authLoading) return;

    const inAuthGroup = segments[0] === '(auth)' || segments[0] === 'onboarding';
    const inTabsGroup = segments[0] === '(tabs)';

    // If user is signed in and trying to access auth/onboarding, redirect to tabs
    if (session && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!session && inTabsGroup) {
      // If user is not signed in and trying to access tabs, redirect to login
      router.replace('/(auth)/login');
    }
  }, [session, authLoading, segments]);

  useEffect(() => {
    if (fontsLoaded && playfairLoaded && !authLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, playfairLoaded, authLoading]);

  // Wait for fonts and auth check before rendering to avoid flashes
  if (!fontsLoaded || !playfairLoaded || authLoading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ToastProvider>
        <GlobalAlertProvider>
          <SquadsProvider>
            <HabitsProvider>
              <NavThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{ contentStyle: { backgroundColor: '#09090b' }, headerShown: false }}>
                  <Stack.Screen name="splash" />
                  <Stack.Screen name="onboarding" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                  <Stack.Screen name="settings" options={{ presentation: 'modal', title: 'Configuración' }} />
                  <Stack.Screen name="vision-gallery" options={{ presentation: 'fullScreenModal', headerShown: false }} />
                  <Stack.Screen name="paywall" options={{ presentation: 'fullScreenModal', headerShown: false }} />
                  <Stack.Screen name="duality-tree" options={{ headerTitle: '', headerTransparent: true, headerTintColor: '#fff' }} />
                  <Stack.Screen name="squad-dashboard" options={{ presentation: 'modal', title: 'Squads' }} />
                </Stack>
                <StatusBar style="light" />
              </NavThemeProvider>
            </HabitsProvider>
          </SquadsProvider>
        </GlobalAlertProvider>
      </ToastProvider>
    </GestureHandlerRootView>
  );
}
