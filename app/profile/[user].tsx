import React from 'react';
import ProfilePage from '../../components/ProfilePage';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function Profile() {
    var { user } = useLocalSearchParams();
    user = Array.isArray(user) ? user[0] : user;

    return (
        <View className='flex-1'>
            {/* <Stack.Screen options={{ title: "Profile View", headerShown: true }} /> */}
            {/* <ProfilePage user={user} /> */}
        </View>
    )
}