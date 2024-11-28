import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import ProfilePage from '../../components/ProfilePage';
import { useAuth } from '../context/auth';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import AuthWall from '../../components/AuthWall';
import { ProfileHeader } from '../../components/Header';

export default function Profile() {
    const { user } = useAuth();

    return (
        <View className='flex-1'>
            {/* <Stack.Screen
                options={{
                    headerShown: true,
                    header: () => <ProfileHeader />
                }}
            /> */}
            {user ?
                <ProfilePage user={user} />
                :
                <AuthWall />
            }
        </View>
    )
}