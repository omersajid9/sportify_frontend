import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Pressable } from 'react-native';
import { Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ReloadButton(reload: any) {

  return (
    <View className="absolute left-1/2 top-2 -translate-x-1/2 right-3 items-center justify-end pb-4 z-50">
      {/* Circular Button */}
      <TouchableOpacity
        className="px-4 py-2 rounded-2xl bg-[#EAEAEA] items-center justify-center shadow-lg"
        onPress={reload.reload}
      >
        <Text className=' text-lg font-semibold'>Search here</Text>
        {/* <MaterialCommunityIcons name="reload" size={24} color="rgb(34 34 34)" /> */}
      </TouchableOpacity>

    </View>
  );
};