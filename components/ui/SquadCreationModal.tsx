import { useSquads } from '@/hooks/useSquads';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View } from 'react-native';

type Props = {
    visible: boolean;
    onClose: () => void;
};

export function SquadCreationModal({ visible, onClose }: Props) {
    const { createSquad } = useSquads();
    const [squadName, setSquadName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (squadName.trim().length === 0) return;

        setLoading(true);
        const result = await createSquad(squadName);
        setLoading(false);

        if (result) {
            setSquadName('');
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' }}
                onPress={onClose}
            >
                <Pressable
                    style={{ width: '85%', maxWidth: 400 }}
                    onPress={(e) => e.stopPropagation()}
                >
                    <LinearGradient
                        colors={['rgba(30,30,35,0.98)', 'rgba(20,20,25,0.98)']}
                        style={{
                            borderRadius: 24,
                            padding: 24,
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.1)',
                        }}
                    >
                        {/* Header */}
                        <View style={{ marginBottom: 24 }}>
                            <Text style={{ fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 8 }}>
                                ⚔️ Create Squad
                            </Text>
                            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                                Form your accountability team (2-5 members)
                            </Text>
                        </View>

                        {/* Squad Name Input */}
                        <View style={{ marginBottom: 24 }}>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
                                Squad Name
                            </Text>
                            <TextInput
                                value={squadName}
                                onChangeText={setSquadName}
                                placeholder="Monk Mode Warriors"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                maxLength={30}
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: 12,
                                    padding: 16,
                                    fontSize: 16,
                                    color: '#fff',
                                }}
                            />
                            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>
                                {squadName.length}/30 characters
                            </Text>
                        </View>

                        {/* Info Box */}
                        <View
                            style={{
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                borderWidth: 1,
                                borderColor: 'rgba(59, 130, 246, 0.3)',
                                borderRadius: 12,
                                padding: 12,
                                marginBottom: 24,
                            }}
                        >
                            <Text style={{ fontSize: 13, color: 'rgba(147, 197, 253, 1)', lineHeight: 18 }}>
                                💡 You'll get an invite code to share with your team. When a squad member fails, everyone loses HP!
                            </Text>
                        </View>

                        {/* Buttons */}
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <Pressable
                                onPress={onClose}
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    backgroundColor: 'rgba(255,255,255,0.08)',
                                    borderRadius: 12,
                                    padding: 16,
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{ fontSize: 16, fontWeight: '700', color: 'rgba(255,255,255,0.6)' }}>
                                    Cancel
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={handleCreate}
                                disabled={loading || squadName.trim().length === 0}
                                style={{
                                    flex: 1,
                                    backgroundColor: squadName.trim().length === 0 ? 'rgba(255,255,255,0.1)' : '#3b82f6',
                                    borderRadius: 12,
                                    padding: 16,
                                    alignItems: 'center',
                                }}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
                                        Create
                                    </Text>
                                )}
                            </Pressable>
                        </View>
                    </LinearGradient>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
