import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

// Helper to decode base64
function decode(base64: string) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const lookup = new Uint8Array(256);
    for (let i = 0; i < chars.length; i++) {
        lookup[chars.charCodeAt(i)] = i;
    }

    let bufferLength = base64.length * 0.75,
        len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === '=') {
        bufferLength--;
        if (base64[base64.length - 2] === '=') {
            bufferLength--;
        }
    }

    const arraybuffer = new ArrayBuffer(bufferLength),
        bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i += 4) {
        encoded1 = lookup[base64.charCodeAt(i)];
        encoded2 = lookup[base64.charCodeAt(i + 1)];
        encoded3 = lookup[base64.charCodeAt(i + 2)];
        encoded4 = lookup[base64.charCodeAt(i + 3)];

        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
}

export const pickImageFromLibrary = async (aspect: [number, number] = [4, 3]) => {
    try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para cambiar tu avatar.');
            return null;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true, // Allow cropping for better layout fitting
            aspect: aspect, // Use passed aspect ratio
            quality: 0.5, // Compress for speed
            base64: true,
        });

        if (result.canceled || !result.assets[0].base64) {
            return null;
        }

        return result.assets[0];
    } catch (error) {
        Alert.alert('Error', 'No se pudo abrir la galería');
        return null;
    }
};

export const uploadImageToSupabase = async (
    userId: string,
    bucket: string,
    base64: string,
    mimeType: string
): Promise<string | null> => {
    try {
        const fileName = `${userId}/${Date.now()}.jpg`;
        const { error } = await supabase.storage
            .from(bucket)
            .upload(fileName, decode(base64), {
                contentType: mimeType,
                upsert: true,
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (error: any) {
        console.error('Upload error:', error);
        Alert.alert('Error al subir imagen', error.message);
        return null;
    }
};
