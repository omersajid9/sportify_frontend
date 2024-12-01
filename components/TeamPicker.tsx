import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

interface UserDetails {
  id: string;
  username: string;
  profile_picture: string;
}

interface TeamPickerProps {
  selectedPlayers: UserDetails[];
  remainingPlayers: UserDetails[];
  toggleMember: (selectedUser: UserDetails) => void;
  placeholder: string;
}

export default function TeamPicker({ selectedPlayers, remainingPlayers, toggleMember, placeholder }: TeamPickerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (remainingPlayers?.length === 0 && isExpanded) {
    setIsExpanded(false);
  }

  return (
    <View className="flex-1">
      <View className="rounded-lg mx-4 overflow-hidden">
        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          className="flex flex-row justify-between items-center border-[#222222] border-2 px-4 py-3 rounded-lg w-full"
        >
          <Text className="text-gray-600 text-sm">{placeholder}</Text>
          <MaterialIcons
            name={isExpanded ? "expand-less" : "expand-more"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
        {isExpanded && (
          <ScrollView className="bg-white max-h-64">
            {remainingPlayers?.map((player: UserDetails, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleMember(player)}
                className="flex-row items-center p-3 border-b border-gray-50 active:bg-gray-50"
              >
                {/* Checkbox */}
                <View
                  className={`w-5 h-5 rounded items-center justify-center mr-3 border ${
                    selectedPlayers.find(p => p.id === player.id)
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedPlayers.find(p => p.id === player.id) && (
                    <MaterialIcons name="check" size={16} color="white" />
                  )}
                </View>
                {/* Player Info */}
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700">{player.username}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
      <View className="flex-wrap flex-row p-2">
        {selectedPlayers?.map((member: UserDetails, index: number) => (
          <View
            key={index}
            className="bg-transparent px-3 py-1 mx-1 my-1 rounded-full flex-row items-center"
          >
            <Text className="text-blue-800 text-sm mr-1">{member.username}</Text>
            <TouchableOpacity onPress={() => toggleMember(member)} className="ml-1">
              <MaterialIcons name="close" size={16} color="#1e40af" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}
