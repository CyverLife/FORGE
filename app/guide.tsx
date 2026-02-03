import { GradientBackground } from '@/components/ui/GradientBackground';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SkiaGlassPane } from '@/components/ui/SkiaGlassPane';
import { Image } from 'expo-image';
import { router, Stack } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GuideScreen() {
    return (
        <SafeAreaView className="flex-1 bg-deep-black">
            <GradientBackground>
                <Stack.Screen options={{ headerShown: false }} />

                {/* Header */}
                <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="bg-white/10 p-2 rounded-full active:scale-95"
                    >
                        <IconSymbol name="chevron.left" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white font-black text-lg uppercase tracking-widest font-display">
                        MANIFIESTO
                    </Text>
                    <View className="w-10" />
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                    {/* Hero Section */}
                    <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-8 items-center">
                        <View className="w-24 h-24 bg-forge-orange/10 rounded-full items-center justify-center mb-4 border border-forge-orange/30">
                            <IconSymbol name="flame.fill" size={48} color="#F97316" />
                        </View>
                        <Text className="text-white font-black text-3xl text-center uppercase tracking-tighter mb-2">
                            LA FORJA INTERNA
                        </Text>
                        <Text className="text-gray-400 text-center text-sm leading-6">
                            No estás aquí para "intentarlo". Estás aquí para decidir quién gana la guerra diaria por tu consciencia.
                        </Text>
                    </Animated.View>

                    {/* Section 1: Angel vs Simio */}
                    <Animated.View entering={FadeInRight.delay(200).springify()} className="mb-8">
                        <SkiaGlassPane height={undefined} cornerRadius={20} backgroundColor="rgba(30, 30, 35, 0.6)" borderColor="rgba(255,255,255,0.1)">
                            <View className="p-6">
                                <View className="flex-row items-center gap-3 mb-4">
                                    <IconSymbol name="scalemass.fill" size={24} color="#60A5FA" />
                                    <Text className="text-white font-bold text-xl uppercase">El conflicto ETERNO</Text>
                                </View>
                                <Text className="text-gray-300 mb-4 leading-relaxed">
                                    Dentro de ti habitan dos fuerzas opuestas:
                                </Text>

                                <View className="flex-row gap-4 mb-4">
                                    <View className="flex-1 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 items-center">
                                        <IconSymbol name="star.fill" size={24} color="#60A5FA" />
                                        <Text className="text-blue-400 font-bold mt-2 uppercase text-xs tracking-wider">EL ÁNGEL</Text>
                                        <Text className="text-white/60 text-[10px] text-center mt-1">Disciplina, Visión, Sacrificio.</Text>
                                    </View>
                                    <View className="flex-1 bg-red-500/10 p-3 rounded-xl border border-red-500/20 items-center">
                                        <IconSymbol name="flame.fill" size={24} color="#EF4444" />
                                        <Text className="text-red-400 font-bold mt-2 uppercase text-xs tracking-wider">EL SIMIO</Text>
                                        <Text className="text-white/60 text-[10px] text-center mt-1">Placer, Pereza, Impulso.</Text>
                                    </View>
                                </View>
                            </View>
                        </SkiaGlassPane>
                    </Animated.View>

                    {/* Section 2: Why 50%? */}
                    <Animated.View entering={FadeInRight.delay(300).springify()} className="mb-8">
                        <SkiaGlassPane height={undefined} cornerRadius={20} backgroundColor="rgba(30, 30, 35, 0.6)" borderColor="rgba(255,255,255,0.1)">
                            <View className="p-6">
                                <View className="flex-row items-center gap-3 mb-4">
                                    <IconSymbol name="chart.bar.fill" size={24} color="#8B5CF6" />
                                    <Text className="text-white font-bold text-xl uppercase">¿Por qué 50%?</Text>
                                </View>
                                <Text className="text-gray-300 leading-relaxed font-medium">
                                    <Text className="text-purple-400 font-bold">La Coherencia</Text> comienza en el centro. No eres ni un santo ni un pecador al despertar; eres un campo de batalla neutral.
                                </Text>
                                <View className="h-px bg-white/10 my-4" />
                                <Text className="text-gray-400 text-sm leading-6">
                                    Cada decisión que tomas mueve la aguja.{'\n'}
                                    • Cumplir un hábito = <Text className="text-blue-400">+ Puntos Ángel</Text>{'\n'}
                                    • Fallar o ceder = <Text className="text-red-400">+ Puntos Simio</Text>
                                </Text>
                            </View>
                        </SkiaGlassPane>
                    </Animated.View>

                    {/* Section 3: The Portal */}
                    <Animated.View entering={FadeInRight.delay(400).springify()} className="mb-8">
                        <SkiaGlassPane height={undefined} cornerRadius={20} backgroundColor="rgba(30, 30, 35, 0.6)" borderColor="rgba(255,255,255,0.1)">
                            <View className="p-6">
                                <View className="flex-row items-center gap-3 mb-4">
                                    <IconSymbol name="eye.fill" size={24} color="#F97316" />
                                    <Text className="text-white font-bold text-xl uppercase">El Portal</Text>
                                </View>
                                <Text className="text-gray-300 leading-relaxed mb-4">
                                    Lo que ves en el Dashboard no es solo un adorno. Es el reflejo de tu estado mental actual.
                                </Text>
                                <View className="flex-row items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                                    <Image source={require('@/assets/images/portal_texture.png')} style={{ width: 40, height: 40 }} contentFit="contain" />
                                    <View className="flex-1">
                                        <Text className="text-white font-bold text-xs uppercase">Brillante y azul</Text>
                                        <Text className="text-gray-500 text-[10px]">Dominio total. Estás en racha.</Text>
                                    </View>
                                </View>
                                <View className="flex-row items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5 mt-2">
                                    <View className="w-10 h-10 rounded-full bg-red-900/50 items-center justify-center border border-red-500/30">
                                        <IconSymbol name="exclamationmark.triangle.fill" size={16} color="#EF4444" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white font-bold text-xs uppercase">Oscuro y rojo</Text>
                                        <Text className="text-gray-500 text-[10px]">El Simio está ganando. Cuidado.</Text>
                                    </View>
                                </View>
                            </View>
                        </SkiaGlassPane>
                    </Animated.View>

                    {/* Section 4: The 4 Elements */}
                    <Animated.View entering={FadeInRight.delay(500).springify()} className="mb-8">
                        <SkiaGlassPane height={undefined} cornerRadius={20} backgroundColor="rgba(30, 30, 35, 0.6)" borderColor="rgba(255,255,255,0.1)">
                            <View className="p-6">
                                <View className="flex-row items-center gap-3 mb-6">
                                    <IconSymbol name="square.grid.2x2.fill" size={24} color="#10B981" />
                                    <Text className="text-white font-bold text-xl uppercase">Los 4 Elementos</Text>
                                </View>

                                <View className="gap-4">
                                    {/* FUEGO */}
                                    <View className="flex-row gap-4 items-start">
                                        <View className="w-10 h-10 rounded-lg bg-orange-500/10 items-center justify-center border border-orange-500/20">
                                            <IconSymbol name="flame.fill" size={20} color="#F97316" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-orange-400 font-black text-sm uppercase tracking-wider mb-1">FUEGO (MOMENTUM)</Text>
                                            <Text className="text-gray-400 text-xs leading-5">
                                                Tu capacidad de mantener la racha viva. Es la intensidad con la que atacas tus objetivos diarios. Si se apaga, te detienes.
                                            </Text>
                                        </View>
                                    </View>

                                    {/* ACERO */}
                                    <View className="flex-row gap-4 items-start">
                                        <View className="w-10 h-10 rounded-lg bg-blue-500/10 items-center justify-center border border-blue-500/20">
                                            <IconSymbol name="shield.fill" size={20} color="#3B82F6" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-blue-400 font-black text-sm uppercase tracking-wider mb-1">ACERO (DISCIPLINA)</Text>
                                            <Text className="text-gray-400 text-xs leading-5">
                                                Hacerlo aunque no tengas ganas. La estructura rígida que sostiene tu vida cuando la motivación falla.
                                            </Text>
                                        </View>
                                    </View>

                                    {/* HIERRO */}
                                    <View className="flex-row gap-4 items-start">
                                        <View className="w-10 h-10 rounded-lg bg-gray-500/10 items-center justify-center border border-gray-500/20">
                                            <IconSymbol name="dumbbell.fill" size={20} color="#9CA3AF" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-gray-300 font-black text-sm uppercase tracking-wider mb-1">HIERRO (RESISTENCIA)</Text>
                                            <Text className="text-gray-400 text-xs leading-5">
                                                Fortaleza física y mental. Tu capacidad de soportar la presión, el dolor y la incomodidad sin romperte.
                                            </Text>
                                        </View>
                                    </View>

                                    {/* FOCO */}
                                    <View className="flex-row gap-4 items-start">
                                        <View className="w-10 h-10 rounded-lg bg-purple-500/10 items-center justify-center border border-purple-500/20">
                                            <IconSymbol name="scope" size={20} color="#8B5CF6" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-purple-400 font-black text-sm uppercase tracking-wider mb-1">FOCO (CLARIDAD)</Text>
                                            <Text className="text-gray-400 text-xs leading-5">
                                                Precisión en la acción. Saber exactamente qué hacer y hacerlo sin distracciones. La mente afilada.
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </SkiaGlassPane>
                    </Animated.View>

                    {/* Footer */}
                    <View className="items-center mt-4 mb-8">
                        <Text className="text-white/30 text-xs italic">
                            "La forja no perdona, solo transforma."
                        </Text>
                    </View>

                </ScrollView>
            </GradientBackground>
        </SafeAreaView>
    );
}
