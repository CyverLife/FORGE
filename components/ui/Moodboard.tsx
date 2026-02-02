import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { GlassPane } from '../ui/GlassPane';

interface MoodBoardImage {
    id: string;
    image_url: string;
    description?: string;
}

export const Moodboard = () => {
    const { session } = useAuth();
    const [images, setImages] = useState<MoodBoardImage[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (session?.user) fetchImages();
    }, [session]);

    const fetchImages = async () => {
        // Mocking data structure fetch for now, assuming table exists or using storage listing
        const { data, error } = await supabase.from('moodboard_images').select('*');
        if (data) setImages(data);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            // @ts-ignore
            mediaTypes: ImagePicker.MediaType.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
            base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
            uploadImage(result.assets[0].base64);
        }
    };

    const uploadImage = async (base64: string) => {
        try {
            setUploading(true);
            const fileName = `${session?.user.id}/${Date.now()}.png`;

            const { data, error } = await supabase.storage
                .from('vision-board')
                .upload(fileName, decode(base64), { contentType: 'image/png' });

            if (error) throw error;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage.from('vision-board').getPublicUrl(fileName);

            // Save to DB
            await supabase.from('moodboard_images').insert({
                user_id: session?.user.id,
                image_url: publicUrl
            });

            fetchImages();
        } catch (error) {
            Alert.alert('Upload Failed', 'Could not upload vision.');
        } finally {
            setUploading(false);
        }
    };

    // Helper for base64 decode if needed or use FormData directly in real app
    const decode = (str: string) => Uint8Array.from(atob(str), c => c.charCodeAt(0));

    return (
        <View className="flex-1 w-full mt-4">
            <View className="flex-row justify-between items-center mb-6 px-2">
                <View className="flex-1 mr-4">
                    <Text className="text-white font-bold text-2xl tracking-[2px]">VISION OF LIFE</Text>
                    <GlassPane className="mt-2 p-3 rounded-lg border border-white/5">
                        <Text className="text-gray-400 text-[10px] italic leading-relaxed">
                            "THE SCULPTOR PARADOX: Without a vision, you chisel at random. Define your masterpiece or risk becoming a shapeless rock."
                        </Text>
                    </GlassPane>
                </View>
                <TouchableOpacity onPress={pickImage} disabled={uploading} className="bg-white/10 p-2 rounded-full border border-white/20">
                    <IconSymbol name="plus" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={images}
                numColumns={2}
                keyExtractor={(item) => item.id}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                renderItem={({ item }) => (
                    <GlassPane className="w-[48%] h-40 mb-4 rounded-xl overflow-hidden border border-white/5">
                        <Image source={{ uri: item.image_url }} className="w-full h-full opacity-80" resizeMode="cover" />
                    </GlassPane>
                )}
                ListEmptyComponent={
                    <View className="items-center justify-center p-6 border border-white/10 rounded-2xl bg-white/5 mx-2">
                        <Image
                            source={require('@/assets/images/sculptor_vision_bg.png')}
                            className="w-full h-48 rounded-xl opacity-80 mb-4"
                            resizeMode="cover"
                        />
                        <Text className="text-gray-400 mt-2 text-center font-bold">THE UNSCULPTED STONE</Text>
                        <Text className="text-gray-600 text-[10px] text-center mt-1 px-4">
                            "The sculpture is already complete within the marble block, before I start my work. It is already there, I just have to chisel away the superfluous material."
                        </Text>
                        <View className="mt-4 flex-row items-center">
                            <IconSymbol name="plus.circle.fill" size={20} color="#F97316" />
                            <Text className="text-magma ml-2 font-bold text-xs uppercase tracking-widest">Begin Sculpting</Text>
                        </View>
                    </View>
                }
            />
        </View>
    );
};
