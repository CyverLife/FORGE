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

// Notifications removed for Expo Go compatibility
// import { registerForPushNotificationsAsync, scheduleDailyReminder } from '@/utils/notifications';
// import { useEffect } from 'react';

import { ToastProvider } from '@/context/ToastContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // useEffect(() => {
  //   async function setupNotifications() {
  //     const hasPermission = await registerForPushNotificationsAsync();
  //     if (hasPermission) {
  //       await scheduleDailyReminder(9, 0); // 9:00 AM Daily Reminder
  //     }
  //   }
  //   setupNotifications();
  // }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <ToastProvider>
          <AuthProvider>
            <NavThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack>
                <Stack.Screen name="splash" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              </Stack>
              <StatusBar style="light" />
            </NavThemeProvider>
          </AuthProvider>
        </ToastProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
