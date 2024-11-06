import { View, ActivityIndicator, Text } from 'react-native';
import React from 'react';



export default function Loader() {
    return (
        <View className="justify-center items-center bg-transparent my-2">
            <ActivityIndicator size="large" color="#4B5563" className="mb-4" />
            <Text className="text-lg font-medium text-gray-600">Loading...</Text>
        </View>
    )
}