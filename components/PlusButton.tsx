import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Pressable } from 'react-native';
import { Modal } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { BounceIn, FadeInDown, FadeInLeft, FadeInRight, FadeInUp, FadeOutLeft, Layout, runOnJS } from 'react-native-reanimated';
import { AnimatePresence } from 'moti';

import { MotiView } from 'moti'; // Import MotiView

export default function PlusButton() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="absolute bottom-20 left-1/2 -translate-x-1/2 items-center justify-end pb-4">
      <TouchableOpacity
        className="w-16 h-16 rounded-full bg-[#e0edd4] border-[#222222] border-[3px] items-center justify-center "
        onPress={() => setModalVisible(true)}>
        <Octicons name="plus" size={24} color="rgb(34 34 34)" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          className="flex-1 bg-black opacity-50"
          onPress={() => setModalVisible(false)}/>
        <View className='relative'>
          <View className="absolute bottom-safe-offset-24 left-1/2 transform -translate-x-1/2 bg-transparent p-6 rounded-lg ">
            <AnimatePresence>
              {modalVisible ?
                <>
                  <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    exit={{ opacity: 0, translateY: 20 }}
                    transition={{ type: 'timing', duration: 300 }}>
                    <TouchableOpacity
                      className="bg-transparent border-[#222222] border-2 px-6 py-4 rounded-full mb-2"
                      onPress={() => {
                        setModalVisible(false);
                        router.push('/createSession');
                      }}>
                      <Text className="text-[#222222] font-bold text-center">Create Session</Text>
                    </TouchableOpacity>
                  </MotiView>

                  <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    exit={{ opacity: 0, translateY: 20 }}
                    transition={{ type: 'timing', duration: 300, delay: 150 }}>
                    <TouchableOpacity
                      className="bg-transparent border-[#222222] border-2 px-6 py-4 rounded-full mb-2"
                      onPress={() => {
                        setModalVisible(false);
                        router.push('/reportScore');
                      }}>
                      <Text className="text-[#222222] font-bold text-center">Report Score</Text>
                    </TouchableOpacity>
                  </MotiView>
                </>
                :
                null}
            </AnimatePresence>
          </View>
        </View>
      </Modal>
    </View>
  );
};