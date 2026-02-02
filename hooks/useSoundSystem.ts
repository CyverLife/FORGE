import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';

// Map of sound keys to require paths (using placeholders for now, user needs to add assets)
// Ideally, we would have real assets. using null for now and we will simulate or just handle the logic.
const SOUND_MAP = {
    portal_open: null, // require('@/assets/sounds/portal_hum.mp3'),
    decision_angel: null, // require('@/assets/sounds/angel_chime.mp3'),
    decision_simio: null, // require('@/assets/sounds/simio_thump.mp3'),
    recalibrate: null, // require('@/assets/sounds/rewind.mp3'),
    ambient_hum: null, // require('@/assets/sounds/ambience.mp3'),
};

type SoundKey = keyof typeof SOUND_MAP;

export const useSoundSystem = () => {
    const [sounds, setSounds] = useState<Record<string, Audio.Sound>>({});

    // Preload sounds (commented out until assets exist, but logic remains)
    /*
    useEffect(() => {
        const loadSounds = async () => {
            const loaded: Record<string, Audio.Sound> = {};
            for (const [key, source] of Object.entries(SOUND_MAP)) {
                if (source) {
                    const { sound } = await Audio.Sound.createAsync(source);
                    loaded[key] = sound;
                }
            }
            setSounds(loaded);
        };
        loadSounds();
        return () => {
            // Unload
            Object.values(sounds).forEach(s => s.unloadAsync());
        };
    }, []);
    */

    const playSound = useCallback(async (key: SoundKey) => {
        // Placeholder for actual sound playback
        console.log(`[SoundSystem] Playing: ${key}`);

        // Combine with Haptics for now since we don't have assets
        switch (key) {
            case 'portal_open':
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                break;
            case 'decision_angel':
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                break;
            case 'decision_simio':
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                break;
            case 'recalibrate':
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                break;
        }

        /* Real implementation:
        const sound = sounds[key];
        if (sound) {
            try {
                await sound.replayAsync();
            } catch (e) {
                console.log('Error playing sound', e);
            }
        }
        */
    }, [sounds]);

    const playHaptic = useCallback((style: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => {
        switch (style) {
            case 'light': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); break;
            case 'medium': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); break;
            case 'heavy': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); break;
            case 'success': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); break;
            case 'warning': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); break;
            case 'error': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); break;
        }
    }, []);

    return { playSound, playHaptic };
};
