import { GradientBackground } from '@/components/ui/GradientBackground';
import { SkiaGlassPane } from '@/components/ui/SkiaGlassPane';

import { useGlobalAlert } from '@/context/GlobalAlertContext';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/useAuth';

export default function AuthScreen() {
    const { showAlert } = useGlobalAlert();
    const { session } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    React.useEffect(() => {
        if (session) {
            router.replace('/(tabs)');
        }
    }, [session]);

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            router.replace('/(tabs)');
        }
        setLoading(false);
    }

    async function signUpWithEmail() {
        setLoading(true);
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) showAlert('Error', error.message);
        else if (!session) showAlert('Éxito', 'Revisa tu correo para verificar tu cuenta');
        setLoading(false);
    }

    return (
        <SafeAreaView className="flex-1 bg-deep-black">
            <GradientBackground>
                <Stack.Screen options={{ headerShown: false }} />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1 justify-center px-6"
                >
                    {/* Minimalist Grid Background - Consistent across app */}
                    <View className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <View
                                key={`v-${i}`}
                                style={{
                                    position: 'absolute',
                                    left: `${(i + 1) * 12.5}%`,
                                    top: 0,
                                    bottom: 0,
                                    width: 1,
                                    backgroundColor: 'rgba(255,255,255,0.03)'
                                }}
                            />
                        ))}
                    </View>

                    {/* Logo */}
                    <Animated.View
                        entering={FadeInDown.delay(0).springify()}
                        className="items-center mb-10"
                    >
                        <Image
                            source={require('@/assets/images/forge_logo_final.png')}
                            style={{ width: 220, height: 100 }}
                            contentFit="contain"
                            placeholder={null}
                            transition={200}
                        />
                        <View className="flex-row items-center gap-2 mt-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                            <IconSymbol name="flame.fill" size={10} color="#F97316" />
                            <Text className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                                Sistema de Hábitos
                            </Text>
                            <IconSymbol name="flame.fill" size={10} color="#F97316" />
                        </View>
                    </Animated.View>

                    {/* Form Container */}
                    <Animated.View entering={FadeInDown.delay(100).springify()}>
                        <SkiaGlassPane
                            height={undefined}
                            cornerRadius={24}
                            backgroundColor="rgba(10, 10, 12, 0.6)"
                            borderColor="rgba(255, 255, 255, 0.1)"
                        >
                            <View className="p-6 gap-y-5">
                                <View>
                                    <Text className="text-text-primary text-2xl font-black mb-1 font-display tracking-wide uppercase">
                                        Acceso
                                    </Text>
                                    <Text className="text-text-secondary text-xs">
                                        Identifícate para sincronizar tu progreso
                                    </Text>
                                </View>

                                <View>
                                    <Text className="text-gray-400 mb-2 ml-1 text-[10px] uppercase tracking-wider font-bold">
                                        Correo Electrónico
                                    </Text>
                                    <TextInput
                                        className="bg-black/40 text-white p-4 rounded-xl border border-white/10 font-medium"
                                        placeholder="tu@email.com"
                                        placeholderTextColor="#4B5563"
                                        onChangeText={setEmail}
                                        value={email}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                </View>

                                <View>
                                    <Text className="text-gray-400 mb-2 ml-1 text-[10px] uppercase tracking-wider font-bold">
                                        Clave de Acceso
                                    </Text>
                                    <TextInput
                                        className="bg-black/40 text-white p-4 rounded-xl border border-white/10 font-medium"
                                        placeholder="••••••••"
                                        placeholderTextColor="#4B5563"
                                        secureTextEntry={true}
                                        onChangeText={setPassword}
                                        value={password}
                                        autoCapitalize="none"
                                    />
                                </View>

                                <TouchableOpacity
                                    onPress={signInWithEmail}
                                    disabled={loading}
                                    className="bg-forge-orange py-4 rounded-xl active:scale-95 transition-transform shadow-lg shadow-orange-500/20 mt-2"
                                    style={{ opacity: loading ? 0.7 : 1 }}
                                >
                                    <Text className="text-black font-black text-center text-sm uppercase tracking-widest">
                                        {loading ? 'Sincronizando...' : 'Entrar al Portal'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </SkiaGlassPane>
                    </Animated.View>

                    {/* Create Account - Minimalist Link */}
                    <Animated.View
                        entering={FadeInDown.delay(200).springify()}
                        className="mt-8 items-center"
                    >
                        <TouchableOpacity
                            onPress={signUpWithEmail}
                            disabled={loading}
                            className="py-3 px-6 rounded-full border border-white/10 active:bg-white/5"
                        >
                            <Text className="text-gray-400 font-bold text-center text-xs uppercase tracking-wider">
                                ¿No tienes cuenta? <Text className="text-white">Inicia el Viaje</Text>
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Social Proof / Footer */}
                    <Animated.View
                        entering={FadeInDown.delay(300).springify()}
                        className="absolute bottom-10 self-center"
                    >
                        <Text className="text-white/20 text-[10px] font-mono tracking-widest uppercase">
                            Forged in Deepmind v1.0
                        </Text>
                    </Animated.View>
                </KeyboardAvoidingView>
            </GradientBackground>
        </SafeAreaView>
    );
}
