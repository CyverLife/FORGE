import { IconSymbol } from '@/components/ui/icon-symbol';
import { VisionSlide } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Mock Data for Initial Vision
const INITIAL_SLIDES: VisionSlide[] = [
    {
        id: '1',
        title: 'EL ARQUITECTO',
        subtitle: 'IDENTIDAD NÚCLEO',
        description: 'Construyo sistemas, no solo metas. Mi disciplina es el cimiento sobre el que descansa mi imperio.',
        theme_color: '#C21F1F', // Forge Red (Action)
        image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop'
    },
    {
        id: '2',
        title: 'EL ATLETA',
        subtitle: 'VEHÍCULO FÍSICO',
        description: 'Mi cuerpo es la forja. El dolor es el martillo que da forma a la resistencia infinita.',
        theme_color: '#F59E0B', // Gold (Performance)
        image_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2670&auto=format&fit=crop'
    },
    {
        id: '3',
        title: 'EL MONJE',
        subtitle: 'CLARIDAD MENTAL',
        description: 'En el silencio encuentro la estrategia. El ruido del mundo no penetra mi templo de concentración.',
        theme_color: '#2A2A2E', // Steel (Focus)
        image_url: 'https://images.unsplash.com/photo-1599447421405-0cbe71130703?q=80&w=2670&auto=format&fit=crop'
    }
];

export default function VisionGalleryScreen() {
    const router = useRouter();
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const insets = useSafeAreaInsets();

    const renderItem = ({ item, index }: { item: VisionSlide; index: number }) => (
        <View style={{ width, height, justifyContent: 'flex-end', paddingBottom: 120 }}>
            {/* Background Image with Premium Overlay */}
            {item.image_url && (
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0E0E0E' }}>
                    <Image
                        source={{ uri: item.image_url }}
                        style={{ flex: 1, opacity: 0.6 }} // Increased opacity slightly for visibility
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(14, 14, 14, 0.8)', '#0E0E0E']}
                        locations={[0, 0.6, 1]}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                    />
                </View>
            )}

            <View className="px-8">
                <View className="flex-row items-center mb-6 gap-4">
                    <View style={{ width: 60, height: 4, backgroundColor: item.theme_color }} />
                    <Text style={{ color: item.theme_color, textShadowColor: item.theme_color, textShadowRadius: 10 }} className="font-mono font-bold tracking-[0.4em] text-xs uppercase">
                        {item.subtitle}
                    </Text>
                </View>

                <Text className="text-white text-6xl font-black uppercase tracking-tighter leading-none mb-6 shadow-lg shadow-black">
                    {item.title}
                </Text>

                <View className="border-l-4 pl-6 py-2" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                    <Text className="text-gray-300 text-xl font-medium leading-8">
                        {item.description}
                    </Text>
                </View>
            </View>

            {/* Pagination Indicators - Industrial Style */}
            <View className="absolute top-1/2 right-8 gap-4 items-end">
                {INITIAL_SLIDES.map((_, i) => (
                    <View
                        key={i}
                        style={{
                            width: 6,
                            height: currentIndex === i ? 40 : 6,
                            backgroundColor: currentIndex === i ? item.theme_color : 'rgba(255,255,255,0.2)',
                            borderRadius: 0, // Hard edges
                        }}
                    />
                ))}
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-[#0E0E0E]">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View
                className="absolute left-6 z-10 flex-row items-center gap-4"
                style={{ top: insets.top + 20 }}
            >
                <TouchableOpacity onPress={() => router.back()} className="bg-black/40 p-3 backdrop-blur-md border border-white/10 active:bg-white/10">
                    <IconSymbol name="xmark" size={24} color="#FFF" />
                </TouchableOpacity>
                <View>
                    <Text className="text-white/40 font-mono text-[8px] tracking-[0.3em] uppercase">SISTEMA VISUAL</Text>
                    <Text className="text-white font-bold text-xs tracking-widest uppercase">ARCHIVO 2026</Text>
                </View>
            </View>

            <FlatList
                ref={flatListRef}
                data={INITIAL_SLIDES}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(ev) => {
                    const newIndex = Math.round(ev.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(newIndex);
                }}
                bounces={false}
            />

            {/* Floating Action Button - Industrial */}
            <TouchableOpacity
                className="absolute bottom-12 right-8 flex-row items-center bg-white px-6 h-14 shadow-2xl shadow-black active:scale-95 transition-transform"
                style={{ borderRadius: 0, gap: 12 }}
            >
                <Text className="text-black font-black tracking-[0.2em] text-sm uppercase">EDITAR</Text>
                <IconSymbol name="pencil" size={16} color="#000" />
            </TouchableOpacity>
        </View>
    );
}
