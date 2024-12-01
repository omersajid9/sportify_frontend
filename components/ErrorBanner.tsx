import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ErrorProps {
    message: string;
    refetch: any;
}

export default function ErrorBanner({ message, refetch }: ErrorProps) {
    return (
        <View className="justify-center items-center bg-red-50 p-4">
            <Text className="text-lg font-semibold text-red-600">
                {message}
            </Text>
            <TouchableOpacity
                onPress={() => refetch()}
                className="mt-4 px-4 py-2 bg-[#222222] rounded-full"
            >
                <Text className="text-white font-medium">Reload</Text>
            </TouchableOpacity>
        </View>
    )
}