import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { pickImageFromLibrary, uploadImageToSupabase } from '@/utils/image-uploader';
import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const { user, session } = useAuth();
    const [uploading, setUploading] = useState(false);

    // Configuration states (mocked for now, would typically be in a context)
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [hapticsEnabled, setHapticsEnabled] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    const handlePickImage = async () => {
        if (!user) return;

        // 1. Pick Image
        const asset = await pickImageFromLibrary();
        if (!asset || !asset.base64) return;

        // 2. Upload
        setUploading(true);
        const publicUrl = await uploadImageToSupabase(
            user.id,
            'avatars',
            asset.base64,
            asset.mimeType || 'image/jpeg'
        );

        if (publicUrl) {
            // 3. Update Auth Profile
            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            if (updateError) {
                Alert.alert('Error', 'No se pudo actualizar el perfil');
            } else {
                Alert.alert('Éxito', 'Tu avatar ha sido actualizado');
            }
        }
        setUploading(false);
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        router.replace('/(auth)/login');
    };

    return (
        <SafeAreaView className="flex-1 bg-deep-black">
            <Stack.Screen options={{ headerShown: false }} />

            <View className="px-4 py-4 flex-row items-center border-b border-white/10">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <IconSymbol name="chevron.left" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold ml-4">Configuración</Text>
            </View>

            <ScrollView className="flex-1">
                <View className="p-6 items-center">
                    {/* Profile Section */}
                    <Animated.View entering={FadeInDown.springify()} className="items-center mb-10">
                        <TouchableOpacity onPress={handlePickImage} disabled={uploading}>
                            <View className="w-32 h-32 rounded-full border-4 border-forge-orange overflow-hidden bg-card-black items-center justify-center relative">
                                {user?.user_metadata?.avatar_url ? (
                                    <Image
                                        source={{ uri: user.user_metadata.avatar_url }}
                                        style={{ width: '100%', height: '100%' }}
                                        contentFit="cover"
                                        cachePolicy="none" // Force refresh to show new upload immediately
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
                        <Text className="text-white text-lg font-bold mt-4">{user?.user_metadata?.name || user?.email}</Text>
                        <Text className="text-gray-400 text-sm">{user?.email}</Text>
                    </Animated.View>

                    {/* App Settings Section */}
                    <View className="w-full mb-8">
                        <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-4">PREFERENCIAS</Text>

                        {/* Sound Toggle */}
                        <View className="flex-row items-center justify-between py-3 border-b border-white/5">
                            <View className="flex-row items-center gap-3">
                                <IconSymbol name="speaker.wave.2.fill" size={20} color="#ccc" />
                                <Text className="text-white text-base">Sonido Ambiente</Text>
                            </View>
                            <Switch
                                value={soundEnabled}
                                onValueChange={setSoundEnabled}
                                trackColor={{ false: '#333', true: '#F97316' }}
                            />
                        </View>

                        {/* Haptics Toggle */}
                        <View className="flex-row items-center justify-between py-3 border-b border-white/5">
                            <View className="flex-row items-center gap-3">
                                <IconSymbol name="hand.tap.fill" size={20} color="#ccc" />
                                <Text className="text-white text-base">Vibración (Haptics)</Text>
                            </View>
                            <Switch
                                value={hapticsEnabled}
                                onValueChange={setHapticsEnabled}
                                trackColor={{ false: '#333', true: '#F97316' }}
                            />
                        </View>

                        {/* Notifications Toggle */}
                        <View className="flex-row items-center justify-between py-3 border-b border-white/5">
                            <View className="flex-row items-center gap-3">
                                <IconSymbol name="bell.fill" size={20} color="#ccc" />
                                <Text className="text-white text-base">Notificaciones</Text>
                            </View>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: '#333', true: '#F97316' }}
                            />
                        </View>
                    </View>

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

                    <Text className="text-gray-600 text-xs mt-10">FORGE v1.0.0 (Beta)</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

