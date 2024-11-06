import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

interface TeamPicker {
    selectedPlayers: String[];
    remainingPlayers: String[];
    toggleMember: (selectedUsername: String) => void;
    placeholder: String;
}

export default function TeamPicker({ selectedPlayers, remainingPlayers, toggleMember, placeholder }: TeamPicker) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (remainingPlayers?.length === 0 && isExpanded) {
        setIsExpanded(false);
    }

    return (
        <SafeAreaView className="flex-1">
            <View className="rounded-lg mx-4 overflow-hidden">

                <TouchableOpacity
                    onPress={() => setIsExpanded(!isExpanded)}
                    className="flex-row border-blue-900 border-2 p-4 rounded-lg justify-center items-center text-center"
                >
                    <Text className="text-gray-600 text-sm">
                        {placeholder}
                    </Text>
                    <MaterialIcons
                        name={isExpanded ? "expand-less" : "expand-more"}
                        size={24}
                        color="#666666"
                    />
                </TouchableOpacity>
                {isExpanded && (
                    <ScrollView className="bg-white max-h-64">
                        {remainingPlayers?.map((player: String, index: number) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => toggleMember(player)}
                                className="flex-row items-center p-3 border-b border-gray-50 active:bg-gray-50"
                            >
                                {/* Checkbox */}
                                <View className={`w-5 h-5 rounded items-center justify-center mr-3 border ${selectedPlayers.includes(player)
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'border-gray-300'
                                    }`}>
                                    {selectedPlayers.includes(player) && (
                                        <MaterialIcons
                                            name="check"
                                            size={16}
                                            color="white"
                                        />
                                    )}
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-medium text-gray-700">
                                        {player}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>
            <View className=' flex-wrap flex-row p-2'>
                {selectedPlayers?.map((member: String, index: number) => (
                    <View
                        key={index}
                        className="bg-blue-100 px-3 py-1 mx-1 my-1 rounded-full flex-row items-center"
                    >
                        <Text className="text-blue-800 text-sm mr-1">
                            {member}
                        </Text>
                        <TouchableOpacity
                            onPress={() => toggleMember(member)}
                            className="ml-1"
                        >
                            <MaterialIcons
                                name="close"
                                size={16}
                                color="#1e40af"
                            />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </SafeAreaView>
    );
}

