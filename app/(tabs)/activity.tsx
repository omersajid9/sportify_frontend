import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';


export default function Activity() {
    return (
        <View className=' flex-1 h-full items-center justify-center'>
            <View className='flex flex-row justify-around gap-8 items-center'>
                <TouchableOpacity className='flex items-center justify-center gap-2' onPress={() => router.push("/createSession")}>
                    <Ionicons name="create-outline" size={70} color="black" />
                    <Text className=' font-semibold text-lg'>Create Session</Text>
                </TouchableOpacity>
                <TouchableOpacity className='flex items-center justify-center gap-2' onPress={() => router.push("/reportScore")}>
                    <MaterialCommunityIcons name="scoreboard-outline" size={70} color="black" />
                    <Text className=' font-semibold text-lg'>Report Score</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}