import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function PaywallScreen() {
    const router = useRouter();

    const FEATURES = [
        { title: 'ÁRBOL DE DUALIDAD', value: '$500', desc: 'Desbloquea la arquitectura mental completa.' },
        { title: 'SISTEMA DE VISIÓN', value: '$300', desc: 'Galería ilimitada de identidad futura.' },
        { title: 'COMUNIDAD FORGE', value: '$1,200', desc: 'Acceso a la red de arquitectos de élite.' },
        { title: 'ANALYTICS INFINITO', value: '$400', desc: 'Metrías de evolución sin restricciones.' },
    ];

    return (
        <View className="flex-1 bg-obsidian-void">
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Close Button */}
                <TouchableOpacity onPress={() => router.back()} className="absolute top-12 left-6 z-10 p-2 bg-black/50 rounded-full">
                    <IconSymbol name="xmark" size={24} color="#FFF" />
                </TouchableOpacity>

                {/* Hero Section: Identity Narrative */}
                <View className="pt-24 px-6 mb-12">
                    <View className="flex-row items-center gap-2 mb-4">
                        <View className="w-2 h-2 bg-molten-core" />
                        <Text className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">SISTEMA CERRADO</Text>
                    </View>
                    <Text className="text-white text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-4">
                        NO ERES <Text className="text-[#333]">ELLOS.</Text>{'\n'}
                        ERES EL <Text className="text-molten-core">ARQUITECTO.</Text>
                    </Text>
                    <Text className="text-gray-400 text-lg leading-7 font-medium">
                        La mayoría existe por inercia. Tú estás aquí para construir.
                        El acceso al Sistema Forge no es una compra, es una declaración de guerra contra tu antigua versión.
                    </Text>
                </View>

                {/* Anchoring Section: The Value Stack */}
                <View className="bg-[#141414] py-12 px-6 border-y border-white/5 mb-12">
                    <Text className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-8 text-center">ARSENAL DE HERRAMIENTAS</Text>

                    {FEATURES.map((feature, i) => (
                        <View key={i} className="flex-row justify-between items-center mb-6 border-b border-white/5 pb-4 last:border-0">
                            <View className="flex-1">
                                <Text className="text-white font-black uppercase tracking-tight text-lg">{feature.title}</Text>
                                <Text className="text-gray-600 text-xs font-mono">{feature.desc}</Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-gray-600 text-xs line-through decoration-molten-core">VALOR: {feature.value}</Text>
                            </View>
                        </View>
                    ))}

                    <View className="mt-4 pt-4 border-t border-molten-core/20 flex-row justify-between items-center">
                        <Text className="text-gray-400 font-bold uppercase tracking-widest text-xs">VALOR TOTAL REAL</Text>
                        <Text className="text-white font-black text-2xl">$2,400</Text>
                    </View>
                </View>

                {/* Social Proof: "Transformation" */}
                <View className="px-6 mb-16">
                    <Text className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-6">HISTORIAS DE ORIGEN</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-4">
                        <View className="bg-[#1A1A1A] p-6 w-72 rounded-sm border border-white/5">
                            <View className="flex-row gap-2 mb-4">
                                <View className="bg-green-900/30 px-2 py-1 rounded"><Text className="text-green-500 text-[10px] font-bold">CAOS → ORDEN</Text></View>
                            </View>
                            <Text className="text-gray-300 text-sm italic mb-4">"Antes reaccionaba a la vida. Ahora dicto mis términos. El Árbol de Dualidad expuso mis fallos."</Text>
                            <View className="flex-row items-center gap-2">
                                <View className="w-8 h-8 bg-gray-700 rounded-full" />
                                <View>
                                    <Text className="text-white font-bold text-xs uppercase">ALEX D.</Text>
                                    <Text className="text-gray-600 text-[10px]">INICIADO HACE 3 MESES</Text>
                                </View>
                            </View>
                        </View>

                        <View className="bg-[#1A1A1A] p-6 w-72 rounded-sm border border-white/5 mr-6">
                            <View className="flex-row gap-2 mb-4">
                                <View className="bg-blue-900/30 px-2 py-1 rounded"><Text className="text-blue-500 text-[10px] font-bold">IMPULSO → PROPÓSITO</Text></View>
                            </View>
                            <Text className="text-gray-300 text-sm italic mb-4">"El sistema de Visión no es motivación, es ingeniería mental. Mi ingreso se triplicó."</Text>
                            <View className="flex-row items-center gap-2">
                                <View className="w-8 h-8 bg-gray-700 rounded-full" />
                                <View>
                                    <Text className="text-white font-bold text-xs uppercase">SARAH K.</Text>
                                    <Text className="text-gray-600 text-[10px]">RANGO ORO</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>

                {/* Price Reveal & CTA (The "Application") */}
                <View className="px-6 pb-20">
                    <View className="items-center mb-8">
                        <Text className="text-gray-500 text-xs font-bold uppercase mb-2">PRECIO DE ACCESO HOY</Text>
                        <View className="flex-row items-baseline">
                            <Text className="text-white text-6xl font-black tracking-tighter">$29<Text className="text-2xl text-gray-500">.99</Text></Text>
                            <Text className="text-gray-600 text-xl font-bold ml-2">/ AÑO</Text>
                        </View>
                        <Text className="text-molten-core text-[10px] font-mono mt-2 bg-molten-core/10 px-2 py-1">⚠️ EL PRECIO SUBE EN 48H</Text>
                    </View>

                    <TouchableOpacity
                        className="bg-white h-16 items-center justify-center mb-4 active:bg-gray-200"
                        style={{ borderRadius: 0 }} // Hard industrial
                    >
                        <Text className="text-black font-black text-xl tracking-[0.2em] uppercase">APLICAR AHORA</Text>
                    </TouchableOpacity>

                    <Text className="text-gray-600 text-center text-[10px] px-8">
                        No se garantizan resultados. El sistema solo amplifica tu voluntad existente. Cancelación en cualquier momento.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
