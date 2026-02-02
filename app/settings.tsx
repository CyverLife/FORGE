import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const { user, session } = useAuth();
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
                base64: true,
            });

            if (!result.canceled && result.assets[0].base64) {
                uploadAvatar(result.assets[0].base64, result.assets[0].mimeType || 'image/jpeg');
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo abrir la galería');
        }
    };

    const uploadAvatar = async (base64: string, mimeType: string) => {
        if (!user) return;
        setUploading(true);

        try {
            const fileName = `${user.id}/${Date.now()}.jpg`;
            const { data, error } = await supabase.storage
                .from('avatars')
                .upload(fileName, decode(base64), {
                    contentType: mimeType,
                    upsert: true,
                });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            if (updateError) throw updateError;

            Alert.alert('Éxito', 'Tu avatar ha sido actualizado');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setUploading(false);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        router.replace('/(auth)/login');
    };

    // Helper to decode base64 if needed, but Supabase JS client handles ArrayBuffer/Blob.
    // Simplifying: expo-image-picker gives base64. 
    // Actually, `supabase-js` expects Blob or ArrayBuffer for file uploads in React Native usually.
    // Using `decode` from `base64-arraybuffer` is standard practice.

    // NOTE: Does the user have base64-arraybuffer installed? Prob not.
    // I entered code assuming decode is available. I should check dependencies or add a simple decode utility.
    // Or I can use `FormData` with `uri`.

    return (
        <SafeAreaView className="flex-1 bg-deep-black">
            <Stack.Screen options={{ headerShown: false }} />

            <View className="px-4 py-4 flex-row items-center border-b border-white/10">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <IconSymbol name="chevron.left" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold ml-4">Configuración</Text>
            </View>

            <View className="p-6 items-center">
                <Animated.View entering={FadeInDown.springify()} className="items-center mb-8">
                    <TouchableOpacity onPress={pickImage} disabled={uploading}>
                        <View className="w-32 h-32 rounded-full border-4 border-forge-orange overflow-hidden bg-card-black items-center justify-center relative">
                            {user?.user_metadata?.avatar_url ? (
                                <Image
                                    source={{ uri: user.user_metadata.avatar_url }}
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit="cover"
                                />
                            ) : (
                                <Image
                                    source={require('@/assets/images/simio_angel_concept.png')}
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit="cover"
                                />
                            )}
                            {uploading && (
                                <View className="absolute inset-0 bg-black/50 items-center justify-center">
                                    <ActivityIndicator color="#F97316" />
                                </View>
                            )}
                        </View>
                        <View className="absolute bottom-0 right-0 bg-forge-orange p-2 rounded-full border-2 border-deep-black">
                            <IconSymbol name="camera.fill" size={16} color="white" />
                        </View>
                    </TouchableOpacity>
                    <Text className="text-white text-lg font-bold mt-4">{user?.email}</Text>
                    <Text className="text-gray-400 text-sm">Iniciado</Text>
                </Animated.View>

                <TouchableOpacity
                    onPress={signOut}
                    className="w-full bg-card-black border border-white/10 p-4 rounded-xl flex-row items-center justify-between active:bg-white/5"
                >
                    <View className="flex-row items-center gap-3">
                        <IconSymbol name="arrow.right.square" size={20} color="#EF4444" />
                        <Text className="text-red-500 font-bold">Cerrar Sesión</Text>
                    </View>
                    <IconSymbol name="chevron.right" size={16} color="#666" />
                </TouchableOpacity>

                <Text className="text-gray-600 text-xs mt-10">FORGE v1.0.0 (Concept Build)</Text>
            </View>
        </SafeAreaView>
    );
}

// Simple Base64 decoder for the upload
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
