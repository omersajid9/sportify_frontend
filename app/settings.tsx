import { View, Text, Pressable, Alert } from 'react-native';
import React from 'react';
import { useAuth } from './context/auth';
import axiosInstance from '../services/api';

export default function Settings() {
    const { user, signOut } = useAuth();

    const logoutAlert = () =>
        Alert.alert('Log Out', 'Are you sure?', [
            {
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel',
            },
            { text: 'OK', onPress: () => signOut() },
        ]);
    const deleteAlert = () =>
        Alert.alert('Delete Account', 'Are you sure?', [
            {
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel',
            },
            { text: 'OK', onPress: () => deleteAccount(user) },
        ]);



    const deleteAccount = async (username: string | null) => {
        if (username === null) {
            return;
        }
        const data = {
            username: username
        };
        try {
            const response = await axiosInstance.delete('/player/delete', {
                headers: { 'Content-Type': 'application/json' },
                data: { username }  // Pass `data` inside the options object
            });
            if (response.status === 200) {
                signOut();
            }
        } catch (error: any) {
            Alert.alert("Login Failed", "Invalid username or password");
        }
    }

    return (
        <View className='flex-1 px-20 py-10 h-full gap-5'>
            <Pressable className='p-4 bg-red-100 rounded-lg shadow-sm' onPress={deleteAlert}>
                <Text className='text-center text-lg'>Delete Account</Text>
            </Pressable>
            <Pressable className='p-4 bg-white rounded-lg shadow-sm' onPress={logoutAlert}>
                <Text className='text-center text-lg'>Log out</Text>
            </Pressable>
        </View>
    )
}