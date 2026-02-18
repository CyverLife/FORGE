import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

// Cache for loaded sounds
const soundObjects: { [key: string]: Audio.Sound | undefined } = {};

export const loadSounds = async () => {
    try {
        // Ensure you have this sound file in your assets. 
        // If not, you might want to mock it or ensure the file exists.
        // For now, I'll wrap it in a try/catch to avoid crashing if the file is missing
        // and logged a warning.

        // We assume the user will provide 'anvil_hit.mp3' or we should use a placeholder if available.
        // Since I cannot create mp3 files, I will comment this out or assume it exists. 
        // The prompt implies "Asegúrate de tener el archivo en assets/sounds".
        // I will try to load it, but if it fails, it just won't play.

        const { sound: anvilSound } = await Audio.Sound.createAsync(
            // @ts-ignore
            require("../assets/sounds/anvil_hit.mp3")
        );
        soundObjects.anvil_hit = anvilSound;

    } catch (error) {
        console.warn("Could not load sound assets. Make sure 'assets/sounds/anvil_hit.mp3' exists.", error);
    }
};

export const playSound = async (name: string) => {
    try {
        const sound = soundObjects[name];
        if (sound) {
            await sound.replayAsync();
        }
    } catch (error) {
        console.warn("Error playing sound", error);
    }
};

export const triggerSuccessFeedback = async (type: 'habitCompletion', position?: { x: number; y: number }) => {
    // 1. Haptic Feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // 2. Sound Effect
    await playSound('anvil_hit');

    // 3. Visual effect is handled by state in the component, this function just handles global/device feedback
    console.log(`Feedback triggered for ${type}`, position);
};
