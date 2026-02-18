import { GlassPane } from '@/components/ui/GlassPane';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface AscensionModalProps {
    visible: boolean;
    onClose: () => void;
    onAscend: () => void;
    prestigeLevel: number;
}

export const AscensionModal = ({ visible, onClose, onAscend, prestigeLevel }: AscensionModalProps) => {
    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View className="flex-1 bg-black/95 items-center justify-center px-6">
                <GlassPane className="w-full p-8 border border-white/10 bg-obsidian-void" intensity={40}>
                    <View className="items-center mb-8">
                        <IconSymbol name="infinity" size={64} color="#FFF" />
                        <View className="mt-4 bg-white px-3 py-1">
                            <Text className="text-black font-black text-xs tracking-widest uppercase">CICLO COMPLETADO</Text>
                        </View>
                    </View>

                    <Text className="text-white text-4xl font-black tracking-tighter text-center uppercase mb-2 leading-none">
                        EL JUEGO<Text className="text-molten-core"> INFINITO</Text>
                    </Text>

                    <Text className="text-gray-400 text-center text-sm mb-8 leading-6 font-medium">
                        Has alcanzado el límite de esta forma. La verdadera maestría no es llegar al final, sino tener el coraje de empezar de nuevo con mayor peso.
                    </Text>

                    <View className="bg-obsidian-plate p-6 mb-8 w-full border border-white/5">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-gray-500 text-[10px] font-bold uppercase">GENERACIÓN ACTUAL</Text>
                            <Text className="text-white text-[10px] font-bold uppercase">{prestigeLevel}</Text>
                        </View>
                        <View className="h-px bg-white/10 mb-2" />
                        <View className="flex-row justify-between">
                            <Text className="text-molten-core text-[10px] font-bold uppercase">SIGUIENTE GENERACIÓN</Text>
                            <Text className="text-molten-core text-[10px] font-bold uppercase">{prestigeLevel + 1}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-white w-full h-16 items-center justify-center mb-4 active:bg-gray-200"
                        onPress={onAscend}
                    >
                        <Text className="text-black font-black text-xl tracking-[0.2em] uppercase">RENACER</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose} className="py-2">
                        <Text className="text-gray-600 font-bold text-xs tracking-widest uppercase">PERMANECER EN ESTA FORMA</Text>
                    </TouchableOpacity>
                </GlassPane>
            </View>
        </Modal>
    );
};
