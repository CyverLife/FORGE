import { useSquads } from '@/hooks/useSquads';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View } from 'react-native';

type Props = {
    visible: boolean;
    onClose: () => void;
};

export function JoinSquadModal({ visible, onClose }: Props) {
    const { joinSquad } = useSquads();
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleJoin = async () => {
        if (inviteCode.trim().length !== 6) return;

        setLoading(true);
        const success = await joinSquad(inviteCode);
        setLoading(false);

        if (success) {
            setInviteCode('');
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
                                🤝 Join Squad
                            </Text>
                            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                                Enter the 6-character invite code
                            </Text>
                        </View>

                        {/* Invite Code Input */}
                        <View style={{ marginBottom: 24 }}>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
                                Invite Code
                            </Text>
                            <TextInput
                                value={inviteCode}
                                onChangeText={(text) => setInviteCode(text.toUpperCase())}
                                placeholder="ABC123"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                maxLength={6}
                                autoCapitalize="characters"
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: 12,
                                    padding: 16,
                                    fontSize: 24,
                                    fontWeight: '700',
                                    letterSpacing: 4,
                                    textAlign: 'center',
                                    color: '#fff',
                                }}
                            />
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
                                💡 Ask your squad leader for the invite code. You'll share HP and accountability!
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
                                onPress={handleJoin}
                                disabled={loading || inviteCode.trim().length !== 6}
                                style={{
                                    flex: 1,
                                    backgroundColor: inviteCode.trim().length !== 6 ? 'rgba(255,255,255,0.1)' : '#3b82f6',
                                    borderRadius: 12,
                                    padding: 16,
                                    alignItems: 'center',
                                }}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
                                        Join
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
