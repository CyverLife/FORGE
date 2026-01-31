import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Stack, useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { GlassPane } from '@/components/ui/GlassPane';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntiGravityEngine } from '@/components/skia/AntiGravityEngine';

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

        if (error) Alert.alert(error.message);
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

        if (error) Alert.alert(error.message);
        else if (!session) Alert.alert('Please check your inbox for email verification!');
        setLoading(false);
    }

    return (
        <SafeAreaView className="flex-1 bg-obsidian justify-center">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Background Effect */}
            <View className="absolute top-0 w-full h-1/2 opacity-50">
                <AntiGravityEngine active={false} intensity={0.2} />
            </View>

            <View className="px-6">
                <GlassPane blurAmount={10} opacity={0.05} className="p-8 rounded-3xl">
                    <Text className="text-white text-3xl font-bold text-center mb-8 tracking-widest">FORGE IDENTITY</Text>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-gray-400 mb-2 ml-1">Email</Text>
                            <TextInput
                                className="bg-smoke/50 text-white p-4 rounded-xl border border-white/10"
                                placeholder="initiate@forge.com"
                                placeholderTextColor="#666"
                                onChangeText={setEmail}
                                value={email}
                                autoCapitalize="none"
                            />
                        </View>

                        <View>
                            <Text className="text-gray-400 mb-2 ml-1">Password</Text>
                            <TextInput
                                className="bg-smoke/50 text-white p-4 rounded-xl border border-white/10"
                                placeholder="Password"
                                placeholderTextColor="#666"
                                secureTextEntry={true}
                                onChangeText={setPassword}
                                value={password}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View className="mt-8 space-y-4">
                        <Button title={loading ? "Processing..." : "Sign In"} onPress={signInWithEmail} disabled={loading} />
                        <Button title="Create Account" variant="outline" onPress={signUpWithEmail} disabled={loading} />
                    </View>
                </GlassPane>
            </View>
        </SafeAreaView>
    );
}
