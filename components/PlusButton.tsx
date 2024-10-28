import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Pressable } from 'react-native';
import { Modal } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInLeft, FadeInRight, FadeInUp, FadeOutLeft, Layout, runOnJS } from 'react-native-reanimated';

export default function PlusButton() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="absolute bottom-0 left-1/2 -translate-x-1/2 items-center justify-end pb-4">
      {/* Circular Button */}
      <TouchableOpacity
        className="w-16 h-16 rounded-full bg-blue-900 items-center justify-center "
        onPress={() => setModalVisible(true)}
      >
        <Octicons name="plus" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black opacity-50"
          onPress={() => setModalVisible(false)}
        />


        <Animated.View
          collapsable={false}
          entering={FadeInDown.duration(500)}
        >
          <View className="absolute bottom-40 left-1/2 transform -translate-x-1/2 bg-transparent p-6 rounded-lg ">
            <TouchableOpacity
              className="bg-blue-900 px-6 py-4 rounded-full mb-2"
              onPress={() => {
                setModalVisible(false);
                router.push('/createSession');
              }}
            >
              <Text className="text-white text-center">Create Session</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-blue-900 px-6 py-4 rounded-full mb-2"
              onPress={() => {
                setModalVisible(false);
                router.push('/reportScore');
              }}
            >
              <Text className="text-white text-center">Report Score</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};