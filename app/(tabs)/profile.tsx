import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import ProfilePage from '../../components/ProfilePage';
import { useAuth } from '../context/auth';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Profile() {
    const { user } = useAuth();

    return (
        <View className='flex-1'>
            <View className="flex-row justify-end py-1 px-4">
                <TouchableOpacity onPress={() => router.push("/settings")}>
                    <Ionicons name="settings" size={24} color="rgb(30 58 138)" />
                </TouchableOpacity>
            </View>
            <ProfilePage user={user} />
        </View>
    )
}