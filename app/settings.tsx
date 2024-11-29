import { View, Text, Pressable, Alert } from 'react-native';
import React from 'react';
import { useAuth } from './context/auth';
import axiosInstance from '../services/api';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';


export default function Settings() {
    const { user, signOut } = useAuth();

    const logoutAlert = () =>
        Alert.alert('Log Out', 'Are you sure?', [
            {
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel',
            },
            { text: 'OK', onPress: () => signOut(true) },
        ]);
    const deleteAlert = () =>
        Alert.alert('Delete Account', 'Are you sure?', [
            {
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel',
            },
            { text: 'OK', onPress: () => deleteAccount(user?.id) },
        ]);



    const deleteAccount = async (user_id: string | undefined) => {
        if (user_id === null) {
            return;
        }
        const data = {
            user_id: user_id
        };

        try {
            const response = await axiosInstance.delete('/player/delete', {
                headers: { 'Content-Type': 'application/json' },
                data: { user_id }  // Pass `data` inside the options object
            });
            await signOut(false);
        } catch (error: any) {
            Alert.alert("Login Failed", "Invalid username or password");
        }
    }

    return (
        <View className='flex-1 px-20 py-10 h-full gap-5'>
            <Pressable className=' gap-10 p-4 px-10 bg-green-100 rounded-lg shadow-sm flex flex-row items-center justify-between border-2 border-[#4ade80]' onPress={() => router.navigate("/updateProfile")}>
                <Feather name="edit-2" size={24} color="#4ade80" />
                <Text className=' text-lg font-semibold text-start w-full'>Edit Account</Text>
            </Pressable>
            <Pressable className=' gap-10 p-4 px-10 bg-red-100 rounded-lg shadow-sm flex flex-row items-center justify-between border-2 border-[#f87171]' onPress={deleteAlert}>
                <Feather name="trash" size={24} color="#f87171" />
                <Text className=' text-lg font-semibold text-start w-full'>Delete Account</Text>
            </Pressable>
            <Pressable className=' gap-10 p-4 px-10 bg-white rounded-lg shadow-sm flex flex-row items-center justify-between ' onPress={logoutAlert}>
                <Feather name="log-out" size={24} color="black" />
                <Text className=' text-lg font-semibold text-start w-full'>Log out</Text>
            </Pressable>
        </View>
    )
}