import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";

export default function PlayerSearchView({ item }: any) {
  return (
    <TouchableOpacity onPress={() => router.push("/profile/"+item.username)}>

      <View className="bg-white p-4 mb-4 rounded-lg shadow-sm flex-row items-center">
        <Image
          source={{ uri: item.profile_picture }}
          className="w-12 h-12 rounded-full border-2 border-[#222222] mr-4"
        />
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">{item.username}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}