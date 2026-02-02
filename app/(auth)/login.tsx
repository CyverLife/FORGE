import { GlassPane } from '@/components/ui/GlassPane';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) Alert.alert('Error', error.message);
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

        if (error) Alert.alert('Error', error.message);
        else if (!session) Alert.alert('Éxito', 'Revisa tu correo para verificar tu cuenta');
        setLoading(false);
    }

    return (
        <SafeAreaView className="flex-1 bg-deep-black">
            <Stack.Screen options={{ headerShown: false }} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 justify-center px-6"
            >
                {/* Logo */}
                <Animated.View
                    entering={FadeInDown.delay(0).springify()}
                    className="items-center mb-12"
                >
                    <Image
                        source={require('@/assets/images/forge_logo_final.png')}
                        style={{ width: 200, height: 90 }}
                        contentFit="contain"
                    />
                    <View className="flex-row items-center gap-2 mt-4">
                        <IconSymbol name="flame.fill" size={12} color="#F97316" />
                        <Text className="text-text-secondary text-xs uppercase tracking-widest font-bold">
                            Forja tu destino
                        </Text>
                        <IconSymbol name="flame.fill" size={12} color="#F97316" />
                    </View>
                </Animated.View>

                {/* Premium Copy */}
                <Animated.View
                    entering={FadeInDown.delay(100).springify()}
                    className="mb-8"
                >
                    <Text className="text-text-primary text-3xl font-black text-center mb-3 font-display leading-tight">
                        SOLICITA{'\n'}ACCESO
                    </Text>
                    <Text className="text-text-secondary text-center text-sm">
                        Únete a los que transforman hábitos en poder
                    </Text>
                </Animated.View>

                {/* Form - Glassmorphism */}
                <GlassPane intensity={30} tint="dark" borderOpacity={0.15} className="gap-y-5 p-6 rounded-3xl mb-8">
                    <Animated.View entering={FadeInDown.delay(150).springify()}>
                        <Text className="text-text-secondary mb-2 ml-1 text-xs uppercase tracking-wider font-bold">
                            Email
                        </Text>
                        <TextInput
                            className="bg-black/30 text-text-primary p-4 rounded-xl border border-white/10"
                            placeholder="tu@email.com"
                            placeholderTextColor="#6B7280"
                            onChangeText={setEmail}
                            value={email}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(200).springify()}>
                        <Text className="text-text-secondary mb-2 ml-1 text-xs uppercase tracking-wider font-bold">
                            Contraseña
                        </Text>
                        <TextInput
                            className="bg-black/30 text-text-primary p-4 rounded-xl border border-white/10"
                            placeholder="••••••••"
                            placeholderTextColor="#6B7280"
                            secureTextEntry={true}
                            onChangeText={setPassword}
                            value={password}
                            autoCapitalize="none"
                        />
                    </Animated.View>
                </GlassPane>

                {/* CTAs - Premium Copy */}
                <Animated.View
                    entering={FadeInDown.delay(250).springify()}
                    className="mt-8 gap-y-4"
                >
                    <TouchableOpacity
                        onPress={signInWithEmail}
                        disabled={loading}
                        className="bg-forge-orange py-4 rounded-premium active:scale-97"
                        style={{ opacity: loading ? 0.6 : 1 }}
                    >
                        <Text className="text-deep-black font-black text-center text-base uppercase tracking-widest">
                            {loading ? 'PROCESANDO...' : 'OBTENER ACCESO'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={signUpWithEmail}
                        disabled={loading}
                        className="bg-card-black py-4 rounded-premium border border-border-subtle active:scale-97"
                        style={{ opacity: loading ? 0.6 : 1 }}
                    >
                        <Text className="text-text-primary font-bold text-center text-base uppercase tracking-wider">
                            CREAR CUENTA
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Social Proof */}
                <Animated.View
                    entering={FadeInDown.delay(300).springify()}
                    className="mt-8"
                >
                    <View className="flex-row items-center justify-center gap-2">
                        <IconSymbol name="checkmark.circle.fill" size={16} color="#22C55E" />
                        <Text className="text-text-tertiary text-xs">
                            +1,000 forjadores activos
                        </Text>
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
