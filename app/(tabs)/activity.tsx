import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, Stack } from 'expo-router';
import { HomeHeader } from '../../components/Header';


export default function Activity() {
    return (
        <View className=' flex-1 h-full items-center justify-center'>
                        <Stack.Screen
                            options={{
                                title: "",
                                headerShown: true,
                                headerRight: () => <HomeHeader  />,
                                headerTitle: "title",
                                // // headerTransparent: true,
                                // headerBackground: 'transparent'
                                headerTitleStyle: { color: '#222222' },
                                headerStyle: { backgroundColor: '#F2F2F2' },
                                headerShadowVisible: false,
                                headerTintColor: '#222222',

                                // header: () => <Header />
                            }}
                        />

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