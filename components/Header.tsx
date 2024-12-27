import { useAuth } from "../app/context/auth";
import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import React from 'react'
import { Feather, Ionicons, Octicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { SheetManager } from "react-native-actions-sheet";

export function ProfileHeader() {
    const { user } = useAuth();

    return (
        <View className="pb-2 bg-transparent  rounded-lg mx-2 ">
            {/* <View className="flex-row items-center justify-center">

            </View> */}

            {user ?
                <View className="flex-row items-center gap-4">
                    {/* <TouchableOpacity className="" onPress={() => router.push("/notifications")}>
                        <Ionicons name="notifications" size={30} color="rgb(34 34 34)" />
                    </TouchableOpacity> */}
                    <TouchableOpacity className="" onPress={() => router.navigate("/settings")}>
                        <Octicons name="gear" size={30} color="rgb(34 34 34)" />
                    </TouchableOpacity>
                    {/* <View> */}
                </View>
                :
                <View className="flex-row items-center">
                    <Pressable className='py-1 h-12 flex flex-row items-center justify-center gap-2' onPress={() => SheetManager.show("authsheet")}>
                        <Text className=' text-[#222222] font-bold text-lg'>
                            Login
                        </Text>
                        <Octicons name="sign-in" size={30} color="rgb(34 34 34)" />
                    </Pressable>
                </View>
            }

        </View>

    )
}

export function HomeHeader() {
    const { user } = useAuth();
    return (

        <View className="pb-2 bg-transparent  rounded-lg mx-2  shadow-neutral-400">
            <View className="flex-row items-center justify-center">
            </View>

            {user ?
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity className="" onPress={() => router.push("/notifications")}>
                        <Octicons name="bell" size={30} color="rgb(34 34 34)" />
                    </TouchableOpacity>
                    {/* <TouchableOpacity className="" onPress={() => router.navigate("/profile")}>
                        <Image
                            source={{ uri: user.profile_picture }}
                            className="w-9 h-9 rounded-full border-2 border-[#222222]"
                        />
                    </TouchableOpacity> */}

                    {/* <View> */}
                </View>
                :
                <View className="flex-row items-center">
                    <Pressable className='py-1 h-12 flex flex-row items-center justify-center gap-2' onPress={() => SheetManager.show("authsheet")}>
                        <Text className=' text-[#222222] font-bold text-lg'>
                            Login
                        </Text>
                        <Octicons name="sign-in" size={30} color="rgb(34 34 34)" />
                    </Pressable>
                </View>
            }

        </View>
    )

}

export function TitleHeader({ title }: { title: string }) {
    return (
        <View className="flex-row items-center justify-center px-4 py-3 bg-transparent  rounded-lg mx-2  ">
            <Text className=' text-[#222222] font-bold text-lg'>
                {title}
            </Text>
        </View>
    )
}