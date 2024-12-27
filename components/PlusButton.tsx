import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Pressable } from 'react-native';
import { Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { router } from 'expo-router';


import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withDelay
} from 'react-native-reanimated';

const AnimatedIcon = Animated.createAnimatedComponent(Octicons);
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);


export default function PlusButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const rotation = useSharedValue(modalVisible ? 0 : 45);
  const rotationView = useSharedValue(modalVisible ? 0 : 45);
  const opacity = useSharedValue(modalVisible ? 1 : 1);
  const width = useSharedValue(modalVisible ? 1 : 0);


  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotationView.value}deg` }]
    };
  });
  const animatedViewStyle = useAnimatedStyle(() => {
    return {
      // opacity: 1,
      // width: withDelay(300, withTiming((1 - width.value) * 150, { duration: 300 })),
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const animatedViewStyleA = useAnimatedStyle(() => {
    return {
      // transform: [{ rotate: `${rotationView.value}deg` }, { translateX: rotationView.value * 3 }],
      width: width.value * 170,
      opacity: opacity.value
    };
  });
  const animatedViewStyleB = useAnimatedStyle(() => {
    return {
      // transform: [{ translateY: rotationView.value * 3 }],
      // opacity: withTiming(opacity.value, { duration: 300 })
    };
  });


  const handlePress = () => {
    if (modalVisible) {
      rotation.value = withDelay(300, withTiming(0, { duration: 300 }));
      rotationView.value = withDelay(300, withTiming(45, { duration: 300 }));
      opacity.value = withDelay(300, withTiming(0, { duration: 300 }))
      // width.value = withTiming(0, { duration: 0 });
      width.value = withTiming(0, { duration: 300 })
      // width.value = withDelay(300, withTiming(1, { duration: 300 }));

      // opacity.value = 0
      setTimeout(() => {
        setModalVisible(false);
      }, 600);
    } else {
      setModalVisible(true);
      rotation.value = withTiming(45, { duration: 300 });
      rotationView.value = withTiming(0, { duration: 300 });
      // width.value = withTiming(1, { duration: 300 });
      width.value = withDelay(300, withTiming(1, { duration: 300 }))
      opacity.value = withTiming(1, { duration: 100 })
      // opacity.value = withTiming(1, { duration: 300 })
      // width.value = withDelay(300, withTiming(0, { duration: 300 }));
    }
  };

  return (
    <AnimatedView style={animatedStyle} className=" relative">
      <TouchableOpacity
        className=" rounded-full items-center justify-center "
        onPress={handlePress}
      >
        <AnimatedIcon
          name="plus"
          size={37}
          color="rgb(34 34 34)"
          style={animatedViewStyle}
        />
      </TouchableOpacity>

      {modalVisible && (
        <AnimatedView  
        style={animatedViewStyleA} 
        className="absolute bottom-[150%] right-0 overflow-hidden rounded-lg h-32 min-w-6 flex flex-col gap-2 -mr-3 py-2 ">
          <AnimatedTouchableOpacity 
            className=" bg-[#F2F2f2] flex-1 shadow-sm border-4 border-[#f2f2f2] px-4 py-2 rounded-lg flex flex-row items-center justify-end gap-3"
            onPressOut={() => {
              handlePress()
              setTimeout(() => {

                router.push('/createSession');
              }, 600)
            }}
          >
            <Text className=' text-[#222222] font-semibold text-base   text-justify' style={{flexWrap: "nowrap"}}>Create Session</Text>
            <Ionicons name="create-outline" size={22} color="black" />
          </AnimatedTouchableOpacity>
          <AnimatedTouchableOpacity 
            className=" bg-[#F2F2f2] flex-1 shadow-sm border-4 border-[#f2f2f2] px-4 py-2 rounded-lg w-full flex flex-row items-center justify-end gap-3"
            onPressOut={() => {
              handlePress()
              setTimeout(() => {

                router.push('/reportScore');
              }, 600)
            }}
          >
            <Text className="text-[#222222] font-semibold text-base max-w-full  text-justify" style={{flexWrap: "nowrap"}}>Report Score</Text>
            <MaterialCommunityIcons name="scoreboard-outline" size={24} color="black" />
          </AnimatedTouchableOpacity>
        </AnimatedView>
      )}
    </AnimatedView>

  );
};