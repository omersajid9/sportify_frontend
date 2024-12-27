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
    <View className="shadow-sm w-1/2">
      <View className="rounded-lg mx-4 overflow-hidden shadow-sm">
        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          className="flex flex-row justify-between items-center bg-[#F2F2F2] border-2 px-4 py-3 rounded-lg w-full shadow-sm"
        >
          <Text className="text-[#222222] text-sm">{placeholder}</Text>
          <MaterialIcons
            name={isExpanded ? "expand-less" : "expand-more"}
            size={24}
            color="#222222"
          />
        </TouchableOpacity>
        {isExpanded && (
          <ScrollView className="bg-[#F2F2F2] rounded-lg my-1 max-h-64">
            {remainingPlayers?.map((player: UserDetails, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleMember(player)}
                className="flex-row items-center p-3 border-b border-gray-50 active:bg-gray-50"
              >
                {/* Checkbox */}
                <View
                  className={`w-5 h-5 rounded items-center justify-center mr-3 border ${selectedPlayers.find(p => p.id === player.id)
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-[#222222]'
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
      {selectedPlayers.length > 0 &&
        <View className="flex-wrap flex-row px-2 ">
          {selectedPlayers?.map((member: UserDetails, index: number) => (
            <View
              key={index}
              className="bg-[#F2F2F2] px-3 py-1 mx-1 my-1 rounded-full flex-row items-center shadow-sm"
            >
              <Text className="text-[#222222] text-sm mr-1">{member.username}</Text>
              <TouchableOpacity onPress={() => toggleMember(member)} className="ml-1">
                <MaterialIcons name="close" size={16} color="#222222" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      }
    </View>
  );
}
