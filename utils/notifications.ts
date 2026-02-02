import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export const isNotificationSupported = () => {
    // In SDK 53+, remote notifications are removed from Expo Go on Android.
    if (Platform.OS === 'android' && isExpoGo) {
        return false;
    }
    return true;
};

export const registerForPushNotificationsAsync = async () => {
    if (!isNotificationSupported()) return null;

    // Dynamic import to avoid top-level side effects in Expo Go
    const Notifications = require('expo-notifications');

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        return null;
    }

    return finalStatus;
};

export const scheduleLocalNotification = async (title: string, body: string, seconds: number = 1) => {
    if (!isNotificationSupported()) return;
    const Notifications = require('expo-notifications');

    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds,
            repeats: false,
        },
    });
};

/**
 * Programa un recordatorio diario.
 * @param hour Hora (0-23)
 * @param minute Minuto (0-59)
 */
export const scheduleDailyReminder = async (hour: number = 9, minute: number = 0) => {
    if (!isNotificationSupported()) return;
    const Notifications = require('expo-notifications');

    // Primero cancelamos las anteriores para no duplicar
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "⚔️ La Forja te espera",
            body: "La gravedad pesa hoy. ¿Vas a forjar tu destino o a rendirte?",
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
        },
    });
};
