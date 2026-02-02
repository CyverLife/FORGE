import { JoinSquadModal } from '@/components/ui/JoinSquadModal';
import { SquadCard } from '@/components/ui/SquadCard';
import { SquadCreationModal } from '@/components/ui/SquadCreationModal';
import { useSquads } from '@/hooks/useSquads';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

export default function SquadDashboardScreen() {
    const { squads, activeSquad, setActiveSquad, loading } = useSquads();
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [joinModalVisible, setJoinModalVisible] = useState(false);

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#09090b', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#09090b' }}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
                {/* Header */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontSize: 32, fontWeight: '900', color: '#fff', marginBottom: 8 }}>
                        ⚔️ My Squads
                    </Text>
                    <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>
                        Accountability teams with shared HP
                    </Text>
                </View>

                {/* No Squads State */}
                {squads.length === 0 && (
                    <LinearGradient
                        colors={['rgba(59, 130, 246, 0.15)', 'rgba(37, 99, 235, 0.15)']}
                        style={{
                            borderRadius: 20,
                            padding: 32,
                            borderWidth: 1,
                            borderColor: 'rgba(59, 130, 246, 0.3)',
                            marginBottom: 20,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontSize: 48, marginBottom: 12 }}>⚔️</Text>
                        <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 8, textAlign: 'center' }}>
                            No Squads Yet
                        </Text>
                        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 24 }}>
                            Create a squad or join one with an invite code to start building accountability with your team.
                        </Text>
                    </LinearGradient>
                )}

                {/* Squad List */}
                {squads.length > 0 && (
                    <View style={{ gap: 16, marginBottom: 20 }}>
                        {squads.map((squad) => (
                            <SquadCard
                                key={squad.id}
                                squad={squad}
                                onPress={() => setActiveSquad(squad)}
                            />
                        ))}
                    </View>
                )}

                {/* Action Buttons */}
                <View style={{ gap: 12 }}>
                    <Pressable
                        onPress={() => setCreateModalVisible(true)}
                        style={{
                            backgroundColor: '#3b82f6',
                            borderRadius: 16,
                            padding: 18,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                        }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>
                            ⚔️ Create New Squad
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setJoinModalVisible(true)}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.2)',
                            borderRadius: 16,
                            padding: 18,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                        }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>
                            🤝 Join Squad
                        </Text>
                    </Pressable>
                </View>

                {/* Info Section */}
                <View
                    style={{
                        marginTop: 32,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: 16,
                        padding: 20,
                    }}
                >
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 12 }}>
                        How Squads Work
                    </Text>
                    <View style={{ gap: 12 }}>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <Text style={{ fontSize: 24 }}>🔥</Text>
                            <Text style={{ flex: 1, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 20 }}>
                                When you complete a protocol, your squad gains +2 HP (max 150)
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <Text style={{ fontSize: 24 }}>⚠️</Text>
                            <Text style={{ flex: 1, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 20 }}>
                                When you fail, your squad loses -5 HP. Don't let your team down!
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <Text style={{ fontSize: 24 }}>👥</Text>
                            <Text style={{ flex: 1, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 20 }}>
                                Squads can have 2-5 members. Share the invite code to grow your team.
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Modals */}
            <SquadCreationModal visible={createModalVisible} onClose={() => setCreateModalVisible(false)} />
            <JoinSquadModal visible={joinModalVisible} onClose={() => setJoinModalVisible(false)} />
        </View>
    );
}
