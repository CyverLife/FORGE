import { SquadWithMembers } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

type Props = {
    squad: SquadWithMembers;
    onPress?: () => void;
};

export function SquadCard({ squad, onPress }: Props) {
    const hpPercentage = (squad.collective_hp / 150) * 100;
    const isLowHP = hpPercentage < 30;
    const isMediumHP = hpPercentage >= 30 && hpPercentage < 70;

    const hpColor = isLowHP ? '#ef4444' : isMediumHP ? '#f59e0b' : '#10b981';

    return (
        <Pressable onPress={onPress} disabled={!onPress}>
            <LinearGradient
                colors={['rgba(30,30,35,0.95)', 'rgba(20,20,25,0.95)']}
                style={{
                    borderRadius: 20,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.1)',
                }}
            >
                {/* Squad Name */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <View>
                        <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 }}>
                            ⚔️ {squad.name}
                        </Text>
                        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                            {squad.member_count || squad.members?.length || 0} members • Code: {squad.invite_code}
                        </Text>
                    </View>
                </View>

                {/* HP Bar */}
                <View style={{ marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.7)' }}>
                            Squad HP
                        </Text>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: hpColor }}>
                            {squad.collective_hp}/150
                        </Text>
                    </View>

                    {/* HP Bar Background */}
                    <View
                        style={{
                            height: 12,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderRadius: 6,
                            overflow: 'hidden',
                        }}
                    >
                        {/* HP Bar Fill */}
                        <View
                            style={{
                                height: '100%',
                                width: `${hpPercentage}%`,
                                backgroundColor: hpColor,
                                borderRadius: 6,
                            }}
                        />
                    </View>
                </View>

                {/* Member Status (Today) */}
                {squad.members && squad.members.length > 0 && (
                    <View style={{ marginTop: 8 }}>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
                            Today's Status
                        </Text>
                        <View style={{ gap: 6 }}>
                            {squad.members.slice(0, 5).map((member) => (
                                <View
                                    key={member.id}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingVertical: 4,
                                    }}
                                >
                                    <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                                        {member.user?.email?.split('@')[0] || 'Member'}
                                    </Text>
                                    <View
                                        style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: 4,
                                            backgroundColor: member.personal_hp > 80 ? '#10b981' : member.personal_hp > 50 ? '#f59e0b' : '#ef4444',
                                        }}
                                    />
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </LinearGradient>
        </Pressable>
    );
}
