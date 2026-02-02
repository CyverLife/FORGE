import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { pickImageFromLibrary, uploadImageToSupabase } from '@/utils/image-uploader';
import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientBackground } from '@/components/ui/GradientBackground';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { BADGES } from '@/constants/badges';
import { FRAMES, Frame } from '@/constants/frames';
import { useToast } from '@/context/ToastContext';
import { useGamification } from '@/hooks/useGamification';
import { BlurView } from 'expo-blur';
import { Modal, Pressable } from 'react-native';

export default function SettingsScreen() {
    const { user, session } = useAuth();
    const { level, streak } = useGamification();
    const { showToast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(user?.user_metadata?.name || '');
    const [showFramesModal, setShowFramesModal] = useState(false);
    const [showStreakModal, setShowStreakModal] = useState(false);

    // Dev Mode State
    const [devMode, setDevMode] = useState(false);
    const [devCount, setDevCount] = useState(0);

    // Configuration states (mocked for now, would typically be in a context)
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [hapticsEnabled, setHapticsEnabled] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    // Get current frame
    const currentFrameId = user?.user_metadata?.frame_id || 'default';
    const currentFrame = FRAMES.find(f => f.id === currentFrameId);

    const handlePickImage = async () => {
        if (!user) return;

        // 1. Pick Image (Square for avatar)
        const asset = await pickImageFromLibrary([1, 1]);
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
                showToast('Error', 'No se pudo actualizar el perfil', 'error');
            } else {
                showToast('Éxito', 'Tu avatar ha sido actualizado', 'success');
            }
        }
        setUploading(false);
    };

    const saveName = async () => {
        if (!newName.trim()) {
            setIsEditingName(false);
            return;
        }

        const { error } = await supabase.auth.updateUser({
            data: { name: newName }
        });

        if (error) {
            showToast('Error', 'No se pudo actualizar el nombre', 'error');
        } else {
            setIsEditingName(false);
        }
    };

    const toggleBadge = async (badgeName: string) => {
        if (!user) return;
        const currentBadges = user.user_metadata?.selected_badges || [];
        let newBadges = [...currentBadges];

        if (newBadges.includes(badgeName)) {
            newBadges = newBadges.filter((b: string) => b !== badgeName);
        } else {
            if (newBadges.length >= 3) {
                showToast('Límite Alcanzado', 'Solo puedes equipar 3 insignias a la vez.', 'warning');
                return;
            }
            newBadges.push(badgeName);
        }

        const { error } = await supabase.auth.updateUser({
            data: { selected_badges: newBadges }
        });

        if (!error) {
            showToast('Insignias Actualizadas', `Has ${newBadges.includes(badgeName) ? 'equipado' : 'quitado'}: ${badgeName}`, 'success');
        } else {
            showToast('Error', 'No se pudo guardar la selección', 'error');
        }
    };

    const selectFrame = async (frame: Frame) => {
        let isLocked = true;

        if (devMode) {
            isLocked = false;
        } else if (frame.unlockCondition.type === 'level') {
            isLocked = level < (frame.unlockCondition.value as number);
        } else if (frame.unlockCondition.type === 'streak') {
            isLocked = streak < (frame.unlockCondition.value as number);
        }

        if (isLocked) {
            showToast('Bloqueado', `Necesitas nivel ${frame.unlockCondition.value} para equipar este marco.`, 'error');
            return;
        }

        const { error } = await supabase.auth.updateUser({
            data: { frame_id: frame.id }
        });

        if (!error) {
            setShowFramesModal(false);
            showToast('Marco Equipado', `Has equipado: ${frame.label}`, 'success');
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        router.replace('/(auth)/login');
    };



    const activateGodMode = async () => {
        if (!user) return;
        const { error } = await supabase.from('profiles').update({
            level: 999,
            current_streak: 999,
            xp: 999999,
            anti_gravity_score: 100,
            angel_score: 100,
            simio_score: 0,
            consciousness_rank: 'INFINITO',
            consciousness_level: 99
        }).eq('id', user.id);

        if (error) showToast('Error', 'No se pudo activar el Modo Dios', 'error');
        else showToast('⚡ MODO DIOS ACTIVADO ⚡', 'Nivel 999, Rango Infinito, Racha 999. ¡Disfruta!', 'success');
    };

    const resetStats = async () => {
        if (!user) return;
        const { error } = await supabase.from('profiles').update({
            level: 1,
            current_streak: 0,
            xp: 0,
            anti_gravity_score: 0,
            angel_score: 0,
            simio_score: 0,
            consciousness_rank: 'BRONCE',
            consciousness_level: 1
        }).eq('id', user.id);

        if (error) showToast('Error', 'No se pudo reiniciar', 'error');
        else showToast('Reinicio', 'Stats vueltos a la normalidad.', 'info');
    };

    const handleDevTap = () => {
        const newCount = devCount + 1;
        setDevCount(newCount);
        if (newCount === 7) {
            setDevMode(true);
            showToast('👨‍💻 MODO DESARROLLADOR', 'Has desbloqueado las herramientas de debug.', 'warning');
        }
    };



    return (
        <SafeAreaView className="flex-1 bg-deep-black">
            <GradientBackground>
                <Stack.Screen options={{ headerShown: false }} />

                {/* Minimalist Grid Background */}
                <View className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50">
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
                    {Array.from({ length: 12 }).map((_, i) => (
                        <View
                            key={`h-${i}`}
                            style={{
                                position: 'absolute',
                                top: `${(i + 1) * 8.33}%`,
                                left: 0,
                                right: 0,
                                height: 1,
                                backgroundColor: 'rgba(255,255,255,0.03)'
                            }}
                        />
                    ))}
                </View>

                <View className="px-4 py-4 flex-row items-center border-b border-white/10">
                    <TouchableOpacity onPress={() => router.back()} className="p-2">
                        <IconSymbol name="chevron.left" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDevTap} activeOpacity={1}>
                        <Text className="text-white text-xl font-bold ml-4">Configuración</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="p-6 items-center">
                        {/* Profile Section */}
                        <Animated.View entering={FadeInDown.springify()} className="items-center mb-10 w-full">
                            <TouchableOpacity onPress={handlePickImage} disabled={uploading}>
                                <View className="items-center justify-center relative">
                                    <UserAvatar
                                        url={user?.user_metadata?.avatar_url}
                                        frame={currentFrame}
                                        size={128}
                                    />
                                    {uploading && (
                                        <View className="absolute inset-0 bg-black/50 items-center justify-center">
                                            <ActivityIndicator color="#F97316" />
                                        </View>
                                    )}
                                </View>
                                <View className="absolute -bottom-2 -right-2 bg-forge-orange p-2 rounded-xl border-2 border-deep-black z-10">
                                    <IconSymbol name="camera.fill" size={16} color="white" />
                                </View>
                            </TouchableOpacity>

                            {/* Editable Name */}
                            <View className="flex-row items-center mt-4 mb-2">
                                {isEditingName ? (
                                    <View className="flex-row items-center gap-2">
                                        <TextInput
                                            className="bg-white/10 text-white px-4 py-2 rounded-lg font-bold text-lg min-w-[150px] text-center"
                                            value={newName}
                                            onChangeText={setNewName}
                                            autoFocus
                                            onSubmitEditing={saveName}
                                        />
                                        <TouchableOpacity onPress={saveName} className="bg-forge-orange p-2 rounded-full">
                                            <IconSymbol name="checkmark" size={16} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity onPress={() => setIsEditingName(true)} className="flex-row items-center gap-2">
                                        <Text className="text-white text-lg font-bold">
                                            {user?.user_metadata?.name || user?.email?.split('@')[0]}
                                        </Text>
                                        <IconSymbol name="pencil" size={14} color="#666" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <Text className="text-gray-400 text-sm mb-6">{user?.email}</Text>

                            {/* Change Frame Button */}
                            <TouchableOpacity
                                onPress={() => setShowFramesModal(true)}
                                className="flex-row items-center bg-white/5 border border-white/10 px-5 py-3 rounded-xl active:bg-white/10 mb-8"
                            >
                                <IconSymbol name="paintbrush.fill" size={18} color="#F97316" />
                                <Text className="text-white font-bold ml-2">Personalizar Marco</Text>
                            </TouchableOpacity>

                            {/* Badges Section (Standard) */}
                            <View className="w-full mb-8">
                                <View className="flex-row items-center justify-between mb-4">
                                    <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest">INSIGNIAS DISPONIBLES</Text>
                                    <Text className="text-forge-orange text-[10px] font-bold uppercase">
                                        Equipadas ({user?.user_metadata?.selected_badges?.filter((id: string) => !BADGES.find(b => b.id === id)?.type.match(/RANK|MASTERY/))?.length || 0}/3)
                                    </Text>
                                </View>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-x-4">
                                    {BADGES.filter(b => b.type !== 'MASTERY' && b.type !== 'RANK').map((badge, index) => {
                                        const isSelected = (user?.user_metadata?.selected_badges || []).includes(badge.id);
                                        const isLocked = badge.unlockCondition.type === 'streak' ? streak < (badge.unlockCondition.value as number) : false;

                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                className={`items-center mr-4 ${isLocked ? 'opacity-50' : ''}`}
                                                onPress={() => !isLocked && toggleBadge(badge.id)}
                                                disabled={isLocked}
                                            >
                                                <View className={`w-16 h-16 rounded-lg items-center justify-center border mb-2 ${isSelected ? 'bg-forge-orange/20 border-forge-orange' : 'bg-white/5 border-white/10'}`}>
                                                    <Image source={badge.image} style={{ width: '80%', height: '80%' }} contentFit="contain" />
                                                </View>
                                                <Text className={`text-[10px] uppercase font-bold text-center w-20 ${isSelected ? 'text-forge-orange' : 'text-gray-400'}`} numberOfLines={1}>{badge.label}</Text>
                                                {isLocked && <IconSymbol name="lock.fill" size={12} color="#666" style={{ position: 'absolute', top: 4, right: 4 }} />}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>
                            </View>

                            {/* Ranks Section (Visual Only - Auto Equipped) */}
                            <View className="w-full mb-8">
                                <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-4">RANGOS ALCANZADOS</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-x-4">
                                    {BADGES.filter(b => b.type === 'RANK').map((rankBadge, index) => {
                                        // Rank is determined by global state
                                        const rankKey = rankBadge.id.replace('badge_', '').toUpperCase(); // 'badge_bronze' -> 'BRONZE'
                                        const currentRank = (user?.user_metadata?.consciousness_rank || 'BRONZE').toUpperCase();

                                        const isCurrentRank = currentRank === rankKey;
                                        // Also we can check if this rank is "unlocked" (i.e. if current rank is higher or equal)
                                        // But for now, let's just focus on highlighting the ACTIVE one.

                                        return (
                                            <View
                                                key={index}
                                                className={`items-center mr-4 ${!isCurrentRank ? 'opacity-30' : 'opacity-100'}`}
                                            >
                                                <View className={`w-28 h-16 bg-white/5 rounded-lg items-center justify-center border mb-2 ${isCurrentRank ? 'bg-forge-orange/20 border-forge-orange shadow-lg shadow-orange-500/20' : 'border-white/10'}`}>
                                                    <Image source={rankBadge.image} style={{ width: '90%', height: '90%' }} contentFit="contain" />
                                                </View>
                                                <Text className={`text-[10px] uppercase font-bold ${isCurrentRank ? 'text-forge-orange' : 'text-gray-600'}`}>
                                                    {isCurrentRank ? 'ACTUAL' : rankBadge.label.replace('Rango ', '')}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                </ScrollView>
                            </View>

                            {/* Masteries Section */}
                            <View className="w-full mb-8">
                                <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-4">MAESTRÍAS</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-x-4">
                                    {/* ... existing masteries logic matches ... */}
                                    {BADGES.filter(b => b.type === 'MASTERY').map((mastery, index) => {
                                        const isSelected = (user?.user_metadata?.selected_badges || []).includes(mastery.id);
                                        const isLocked = level < (mastery.unlockCondition.value as number);

                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                className={`items-center mr-4 ${isLocked ? 'opacity-50' : ''}`}
                                                onPress={() => !isLocked && toggleBadge(mastery.id)}
                                                disabled={isLocked}
                                            >
                                                <View className={`w-20 h-24 bg-white/5 rounded-lg items-center justify-center border mb-2 ${isSelected ? 'bg-forge-orange/10 border-forge-orange' : 'border-white/10'}`}>
                                                    <Image
                                                        source={mastery.image}
                                                        style={{ width: '90%', height: '90%' }}
                                                        contentFit="contain"
                                                    />
                                                </View>
                                                <Text className={`text-[10px] uppercase font-bold ${isSelected ? 'text-forge-orange' : 'text-gray-400'}`}>{mastery.label}</Text>
                                                {isLocked && (
                                                    <View className="absolute inset-0 items-center justify-center bg-black/60 rounded-lg">
                                                        <IconSymbol name="lock.fill" size={20} color="#9CA3AF" />
                                                        <Text className="text-white text-[8px] font-bold mt-1">Nvl. {mastery.unlockCondition.value}</Text>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        </Animated.View>

                        {/* App Settings Section */}
                        <View className="w-full mb-8">
                            <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-4">PREFERENCIAS</Text>

                            {/* Toggles */}
                            <View className="gap-y-1">
                                <View className="flex-row items-center justify-between py-3 border-b border-white/5">
                                    <View className="flex-row items-center gap-3">
                                        <IconSymbol name="speaker.wave.2.fill" size={20} color="#ccc" />
                                        <Text className="text-white text-base">Sonido Ambiente</Text>
                                    </View>
                                    <Switch value={soundEnabled} onValueChange={setSoundEnabled} trackColor={{ false: '#333', true: '#F97316' }} />
                                </View>

                                <View className="flex-row items-center justify-between py-3 border-b border-white/5">
                                    <View className="flex-row items-center gap-3">
                                        <IconSymbol name="hand.tap.fill" size={20} color="#ccc" />
                                        <Text className="text-white text-base">Vibración (Haptics)</Text>
                                    </View>
                                    <Switch value={hapticsEnabled} onValueChange={setHapticsEnabled} trackColor={{ false: '#333', true: '#F97316' }} />
                                </View>

                                <View className="flex-row items-center justify-between py-3 border-b border-white/5">
                                    <View className="flex-row items-center gap-3">
                                        <IconSymbol name="bell.fill" size={20} color="#ccc" />
                                        <Text className="text-white text-base">Notificaciones</Text>
                                    </View>
                                    <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} trackColor={{ false: '#333', true: '#F97316' }} />
                                </View>
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

                        {/* Dev Zone */}
                        {devMode && (
                            <View className="w-full mt-10 p-4 border border-yellow-500/30 bg-yellow-500/5 rounded-xl">
                                <Text className="text-yellow-500 font-bold text-xs uppercase tracking-widest mb-4 text-center">ZONA DE DESARROLLO</Text>
                                <View className="gap-y-3">
                                    <TouchableOpacity
                                        onPress={activateGodMode}
                                        className="bg-yellow-500/20 border border-yellow-500/50 p-3 rounded-lg items-center"
                                    >
                                        <Text className="text-yellow-400 font-bold">⚡ ACTIVAR MODO DIOS</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={resetStats}
                                        className="bg-red-500/20 border border-red-500/50 p-3 rounded-lg items-center"
                                    >
                                        <Text className="text-red-400 font-bold">↺ RESETEAR STATS</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setShowStreakModal(true)}
                                        className="bg-orange-500/20 border border-orange-500/50 p-3 rounded-lg items-center"
                                    >
                                        <Text className="text-orange-400 font-bold">🏆 PROBAR ANIMACIÓN RACHA</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        <Text className="text-gray-600 text-xs mt-10">FORGE v1.0.0 (Beta)</Text>
                    </View>
                </ScrollView>

                {/* Frame Selection Modal */}
                <Modal
                    visible={showFramesModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowFramesModal(false)}
                >
                    <BlurView intensity={30} tint="dark" style={{ flex: 1 }}>
                        <Pressable style={{ flex: 1 }} onPress={() => setShowFramesModal(false)} />
                        <View className="absolute bottom-0 w-full h-[70%] bg-[#0E0E0E] rounded-t-3xl border-t border-white/10 overflow-hidden">
                            <View className="p-6 border-b border-white/5 flex-row justify-between items-center">
                                <Text className="text-white font-black text-xl font-display tracking-wider">MARCOS</Text>
                                <TouchableOpacity onPress={() => setShowFramesModal(false)} className="bg-white/10 p-2 rounded-full">
                                    <IconSymbol name="xmark" size={16} color="white" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
                                <View className="flex-row flex-wrap justify-between gap-y-6">
                                    {FRAMES.map((frame) => {
                                        let isLocked = true;
                                        let currentVal = 0;

                                        if (frame.unlockCondition.type === 'level') {
                                            isLocked = level < (frame.unlockCondition.value as number);
                                            currentVal = level;
                                        } else if (frame.unlockCondition.type === 'streak') {
                                            isLocked = streak < (frame.unlockCondition.value as number);
                                            currentVal = streak;
                                        }

                                        const isSelected = currentFrameId === frame.id;

                                        return (
                                            <TouchableOpacity
                                                key={frame.id}
                                                onPress={() => selectFrame(frame)}
                                                className={`w-[48%] bg-white/5 rounded-2xl p-4 border ${isSelected ? 'border-forge-orange bg-forge-orange/10' : 'border-white/5'} ${isLocked ? 'opacity-50' : 'opacity-100'}`}
                                            >
                                                <View className="items-center mb-3 relative">
                                                    <View className="items-center justify-center">
                                                        <UserAvatar
                                                            url={!isLocked ? user?.user_metadata?.avatar_url : null}
                                                            frame={frame}
                                                            size={80}
                                                        />
                                                    </View>
                                                    {isLocked && (
                                                        <View className="absolute inset-0 items-center justify-center bg-black/60 rounded-xl">
                                                            <IconSymbol name="lock.fill" size={24} color="#9CA3AF" />
                                                        </View>
                                                    )}
                                                </View>

                                                <Text className="text-white font-bold text-center mb-1 text-base">{frame.label}</Text>
                                                <Text className="text-gray-400 text-xs text-center">{frame.description}</Text>

                                                {isLocked && (
                                                    <View className="mt-2 bg-white/5 py-1 px-2 rounded-lg">
                                                        <Text className="text-forge-orange text-[10px] text-center font-bold uppercase">
                                                            Req: {frame.unlockCondition.type === 'level' ? `Nivel ${frame.unlockCondition.value}` : `${frame.unlockCondition.value} Días`}
                                                        </Text>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </ScrollView>
                        </View>
                    </BlurView>
                </Modal>

                {/* Streak Success Modal */}
                <Modal
                    visible={showStreakModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowStreakModal(false)}
                >
                    <BlurView intensity={60} tint="dark" style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <Animated.View
                            entering={FadeInDown.springify().damping(12)}
                            className="bg-[#0E0E0E] w-[90%] border-2 border-orange-500/50 p-8 items-center relative overflow-hidden shadow-2xl shadow-orange-500/50"
                            style={{ borderRadius: 4 }}
                        >
                            {/* Epic Background Elements */}
                            <View className="absolute top-0 w-full h-full bg-orange-500/5" />
                            <View className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/20 blur-3xl rounded-full" />
                            <View className="absolute -bottom-20 -left-20 w-40 h-40 bg-red-500/20 blur-3xl rounded-full" />

                            <Text className="text-orange-500 font-black text-4xl mb-2 font-display tracking-[0.2em] italic" style={{ textShadowColor: '#F97316', textShadowRadius: 20 }}>
                                ¡IMPARABLE!
                            </Text>
                            <Text className="text-gray-300 text-center mb-8 font-medium text-sm tracking-widest uppercase">
                                Has mantenido tu disciplina por <Text className="text-white font-bold">{streak} días</Text> seguidos.
                            </Text>

                            <View className="w-48 h-48 mb-10 relative items-center justify-center">
                                {/* Rotating glow behind */}
                                <View className="absolute inset-0 bg-orange-500/30 blur-2xl rounded-full" />
                                <Image
                                    source={require('@/assets/images/badge_streak_fire.png')}
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit="contain"
                                />
                            </View>

                            <TouchableOpacity
                                onPress={() => setShowStreakModal(false)}
                                className="bg-orange-600 w-full py-4 items-center shadow-lg shadow-orange-600/30 border border-orange-400/50 active:scale-95 transition-transform"
                                style={{ borderRadius: 2 }}
                            >
                                <Text className="text-white font-black text-lg tracking-widest uppercase">RECLAMAR GLORIA</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </BlurView>
                </Modal>
            </GradientBackground>
        </SafeAreaView>
    );
}
