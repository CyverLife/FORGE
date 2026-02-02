import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/lib/providers/AuthProvider';
import { QueryProvider } from '@/lib/providers/QueryProvider';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: 'splash',
};

import { isNotificationSupported, registerForPushNotificationsAsync, scheduleDailyReminder } from '@/utils/notifications';
import { useEffect } from 'react';

import { ToastProvider } from '@/context/ToastContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    async function initApp() {
      console.log("DEBUG: Iniciando app...");
      try {
        // Run notification setup in background, don't await/block startup
        if (isNotificationSupported()) {
          registerForPushNotificationsAsync().then(async (hasPermission) => {
            if (hasPermission) {
              await scheduleDailyReminder(9, 0);
            }
          }).catch(err => console.log("Notification setup error:", err));
        }
      } catch (e) {
        console.warn("DEBUG: Error en inicio:", e);
      } finally {
        console.log("DEBUG: Ocultando splash screen");
        await SplashScreen.hideAsync().catch(() => { });
      }
    }
    initApp();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <ToastProvider>
          <AuthProvider>
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
              </Stack>
              <StatusBar style="light" />
            </NavThemeProvider>
          </AuthProvider>
        </ToastProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
