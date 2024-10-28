import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Pressable } from 'react-native';
import { Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ReloadButton(reload: any) {

  return (
    <View className="absolute bottom-0 right-3 items-center justify-end pb-4 z-50">
      {/* Circular Button */}
      <TouchableOpacity
        className="w-16 h-16 rounded-full bg-[#EAEAEA] items-center justify-center shadow-lg"
        onPress={reload.reload}
      >
        <MaterialCommunityIcons name="reload" size={24} color="rgb(30 58 138)" />
      </TouchableOpacity>

    </View>
  );
};