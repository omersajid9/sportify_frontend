import { useAuth } from "../app/context/auth";
import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import React from 'react'
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { SheetManager } from "react-native-actions-sheet";

export function ProfileHeader() {
    const { user } = useAuth();

    return (
        <View className="pb-2 bg-transparent  rounded-lg mx-2 shadow-lg shadow-neutral-400">
            {/* <View className="flex-row items-center justify-center">

            </View> */}

            {user ?
                <View className="flex-row items-center gap-4">
                    {/* <TouchableOpacity className="" onPress={() => router.push("/notifications")}>
                        <Ionicons name="notifications" size={30} color="rgb(30 58 138)" />
                    </TouchableOpacity> */}
                    <TouchableOpacity className="" onPress={() => router.navigate("/settings")}>
                        <Ionicons name="settings-outline" size={30} color="rgb(30 58 138)" />
                    </TouchableOpacity>
                    {/* <View> */}
                </View>
                :
                <View className="flex-row items-center">
                    <Pressable className='py-1 h-12 flex flex-row items-center justify-center gap-2' onPress={() => SheetManager.show("authsheet")}>
                        <Text className=' text-blue-900 font-bold text-lg'>
                            Login
                        </Text>
                        <Feather name="log-in" size={30} color="rgb(30 58 138)" />
                    </Pressable>
                </View>
            }

        </View>

    )
}

export function HomeHeader() {
    const { user } = useAuth();
    return (

        <View className="pb-2 bg-transparent  rounded-lg mx-2 shadow-lg shadow-neutral-400">
            <View className="flex-row items-center justify-center">
            </View>

            {user ?
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity className="" onPress={() => router.push("/notifications")}>
                        <Ionicons name="notifications-outline" size={30} color="rgb(30 58 138)" />
                    </TouchableOpacity>
                    {/* <TouchableOpacity className="" onPress={() => router.navigate("/profile")}>
                        <Image
                            source={{ uri: user.profile_picture }}
                            className="w-9 h-9 rounded-full border-2 border-blue-900"
                        />
                    </TouchableOpacity> */}

                    {/* <View> */}
                </View>
                :
                <View className="flex-row items-center">
                    <Pressable className='py-1 h-12 flex flex-row items-center justify-center gap-2' onPress={() => SheetManager.show("authsheet")}>
                        <Text className=' text-blue-900 font-bold text-lg'>
                            Login
                        </Text>
                        <Feather name="log-in" size={30} color="rgb(30 58 138)" />
                    </Pressable>
                </View>
            }

        </View>
    )

}

export function TitleHeader({ title }: { title: string }) {
    return (
        <View className="flex-row items-center justify-center px-4 py-3 bg-transparent  rounded-lg mx-2 shadow-lg shadow-neutral-400">
            <Text className=' text-blue-900 font-bold text-lg'>
                {title}
            </Text>
        </View>
    )
}