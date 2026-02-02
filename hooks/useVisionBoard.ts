import { useGlobalAlert } from '@/context/GlobalAlertContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

const VISION_STORAGE_KEY = '@forge_vision_board_v1';
const VISION_DIR = `${(FileSystem as any).documentDirectory ?? ''}vision_board/`;

export interface VisionEntry {
    id: string;
    uri: string;
    title: string;
    rotation: number;
    createdAt: number;
    textStyle?: {
        color1: string;          // First word color
        color2: string;          // Rest of text color
        fontSize1: number;       // First word size
        fontSize2: number;       // Rest of text size
        fontFamily: 'display' | 'body' | 'label';
        position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
    };
}

export const useVisionBoard = () => {
    const { showAlert } = useGlobalAlert();
    const [visions, setVisions] = useState<VisionEntry[]>([]);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Initialize: Ensure directory exists and load data
    useEffect(() => {
        const init = async () => {
            try {
                const dirInfo = await FileSystem.getInfoAsync(VISION_DIR);
                if (!dirInfo.exists) {
                    await FileSystem.makeDirectoryAsync(VISION_DIR, { intermediates: true });
                }

                const storedData = await AsyncStorage.getItem(VISION_STORAGE_KEY);
                if (storedData) {
                    const { visions: savedVisions, currentId: savedCurrentId } = JSON.parse(storedData);
                    console.log('🖼️ Vision Board - Loaded visions:', savedVisions.length);
                    console.log('🖼️ Vision Board - Current ID:', savedCurrentId);
                    console.log('🖼️ Vision Board - Sample URI:', savedVisions[0]?.uri);
                    setVisions(savedVisions);
                    setCurrentId(savedCurrentId);
                }
            } catch (error) {
                console.error('Vision Board Init Error:', error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    // Save state to AsyncStorage
    const saveState = async (newVisions: VisionEntry[], newCurrentId: string | null) => {
        try {
            await AsyncStorage.setItem(VISION_STORAGE_KEY, JSON.stringify({
                visions: newVisions,
                currentId: newCurrentId
            }));
        } catch (error) {
            console.error('Save State Error:', error);
        }
    };

    const addVision = async () => {
        if (visions.length >= 3) {
            showAlert('Límite alcanzado', 'Solo puedes tener 3 visiones activas. Elimina una para agregar otra.');
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 0.8,
            });

            if (result.canceled || !result.assets[0].uri) return;

            // Prompt for title
            const promptForTitle = () => new Promise<string>((resolve) => {
                Alert.prompt(
                    'Nueva Visión',
                    'Asigna un nombre a esta visión (ej: INVOCA DESEOS)',
                    [
                        { text: 'Cancelar', style: 'cancel', onPress: () => resolve('') },
                        { text: 'Aceptar', onPress: (text?: string) => resolve(text || 'SIN TÍTULO') }
                    ],
                    'plain-text'
                );
            });

            // Note: Alert.prompt only works on iOS. For cross-platform we should use a custom modal, 
            // but for now I'll use a fixed title or a quick hack if only Android is used.
            // Let's use a default if it's not iOS for simplicity in this turn, 
            // or I can implement a custom modal in the UI later.
            let title = 'NUEVA VISIÓN';
            // Simple check: If on Android, we use a default for now.
            // title = await promptForTitle(); // Uncomment if ios testing

            const sourceUri = result.assets[0].uri;
            const fileName = `vision_${Date.now()}.jpg`;
            const destUri = `${VISION_DIR}${fileName}`;

            await FileSystem.copyAsync({
                from: sourceUri,
                to: destUri
            });

            const newEntry: VisionEntry = {
                id: Date.now().toString(),
                uri: destUri,
                title: title.toUpperCase(),
                rotation: Math.random() * 6 - 3, // -3 to +3
                createdAt: Date.now(),
                textStyle: {
                    color1: '#3B82F6',     // blue-500
                    color2: '#FFFFFF',     // white
                    fontSize1: 36,
                    fontSize2: 28,
                    fontFamily: 'display',
                    position: 'bottom-right'
                }
            };

            console.log('🖼️ Vision Board - New vision created:');
            console.log('   URI:', destUri);
            console.log('   Title:', title);

            const updatedVisions = [...visions, newEntry];
            setVisions(updatedVisions);

            if (!currentId) {
                setCurrentId(newEntry.id);
                saveState(updatedVisions, newEntry.id);
            } else {
                saveState(updatedVisions, currentId);
            }
        } catch (error) {
            console.error('Add Vision Error:', error);
            showAlert('Error', 'No se pudo guardar la imagen.');
        }
    };

    const deleteVision = (id: string) => {
        showAlert(
            'Eliminar Visión',
            '¿Estás seguro de que quieres borrar esta visión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const entryToDelete = visions.find(v => v.id === id);
                            if (entryToDelete) {
                                await FileSystem.deleteAsync(entryToDelete.uri, { idempotent: true });
                            }

                            const updatedVisions = visions.filter(v => v.id !== id);
                            let newCurrentId = currentId;

                            if (currentId === id) {
                                newCurrentId = updatedVisions.length > 0 ? updatedVisions[0].id : null;
                            }

                            setVisions(updatedVisions);
                            setCurrentId(newCurrentId);
                            saveState(updatedVisions, newCurrentId);
                        } catch (error) {
                            console.error('Delete Vision Error:', error);
                        }
                    }
                }
            ]
        );
    };

    const selectVision = (id: string) => {
        setCurrentId(id);
        saveState(visions, id);
    };

    const updateVision = (id: string, updates: Partial<VisionEntry>) => {
        const updatedVisions = visions.map(v => {
            if (v.id === id) {
                return {
                    ...v,
                    ...updates,
                    title: updates.title ? updates.title.toUpperCase() : v.title
                };
            }
            return v;
        });
        setVisions(updatedVisions);
        saveState(updatedVisions, currentId);
    };

    const currentVision = visions.find(v => v.id === currentId) || null;

    return {
        visions,
        currentVision,
        loading,
        addVision,
        deleteVision,
        selectVision,
        updateVision,
    };
};
