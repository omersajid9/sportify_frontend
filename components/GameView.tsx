import React, { useRef, useState } from 'react';
import { View, Text, Image, ViewComponent, Animated, TouchableHighlight, Dimensions } from 'react-native';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { FontAwesome, FontAwesome6, Ionicons, Octicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../app/context/auth';
import SportIcon from './SportIcon';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../services/api';
import { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Loader from './Loader';

interface GameViewProps {
  gameData: any;
  explore: boolean;
}

export default function GameView({ gameData, explore }: GameViewProps) {
  const { user } = useAuth();
  const flRef = useRef<View>(null);
  const queryClient = useQueryClient();
  const [swipeDetected, setSwipeDetected] = useState(false);

  var session = gameData.item;
  
  if (!session) {
    return <Loader />;
  }  
  const handleSubmit = async (rsvp: String) => {
    if (!user) {
      return;
    }
    const data = {
      session_id: session.id,
      player_user_id: user.id,
      player_rsvp: rsvp
    }
    try {
      const response = await axiosInstance.post('/session/rsvp', data, {
        headers: {
          'Content-Type': 'application/json', // Ensure the request is in JSON format
        }
      });
      if (response.status == 200) {
          setTimeout(() => {
            flRef.current?.setNativeProps({
              style: { display: 'none' },
            });
          }, 500)
      }
    } catch (error) {
      console.error('Error creating game:', error);
    }
  }

  const handleSwipeRight = () => {
    handleSubmit("No")
  };

  const handleSwipeLeft = () => {
    handleSubmit("Yes")
  };

  const LeftSwipeActions = () => {
    return (
      <View
        className=' mx-auto  justify-center align-middle w-full rounded-xl'

      >
        {/* <Ionicons name="checkmark-sharp" size={24} color="black" /> */}
        {/* <FontAwesome6 name="check" size={40} color="black" /> */}
        <Octicons name="check" size={40} color="black" />

      </View>
    )
  }

  const RightSwipeActions = () => {
    return (

      <View
        className=' mx-auto items-end  justify-center align-middle w-full rounded-xl'
      >
        {/* <FontAwesome6 name="xmark" size={40} color="black" /> */}
        <Octicons name="x" size={40} color="black" />

      </View>
    )
  }


  const formatDate = (date1: Date, date2: Date): string => {
    var adjustedDate1 = new Date(date1.getTime() - date1.getTimezoneOffset() * 60000);
    var adjustedDate2 = new Date(date2.getTime() - date2.getTimezoneOffset() * 60000);

    const isSameDay = date1.toDateString() === date2.toDateString();
    const options1: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    const options2: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    if (isSameDay) {
      return adjustedDate1.toLocaleString('en-US', options1) + " - " + adjustedDate2.toLocaleString('en-US', options2);
    } else {
      return adjustedDate1.toLocaleString('en-US', options1) + " - " + adjustedDate2.toLocaleString('en-US', options1);
    }
  };

  // Render content
  const renderContent = () => (
    <View 
    
    ref={flRef} className="flex gap-3 mx-auto bg-gray-50 w-full  min-h-60 rounded-xl shadow-sm p-5 border border-gray-200"  >

      {/* <View className='flex flex-row'>
        <SportIcon
          sport_icon={session.sport_icon}
          size={40}
          sport_icon_source={session.sport_icon_source}
          color={'rgb(34 34 34)'} />
      </View>

      <View className=" ">
        <View className=' flex flex-row'>
          <Text className='border-2 w-1/3'>Time</Text>
          <Text className='border-2 w-1/3'>Duration</Text>
          <Text className='border-2 w-1/3'></Text>
        </View>
    </View> */}

      {/* Top Row with Game Type and Player Count */}
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <SportIcon
            sport_icon={session.sport_icon}
            size={16}
            sport_icon_source={session.sport_icon_source}
            color={'rgb(34 34 34)'} />
          <Text className="ml-2 text-gray-600">{session.sport}</Text>
        </View>
        <Text className="text-gray-700 text-sm font-semibold">
          {session.count_rsvps + 1}/{session.max_players} Attending
        </Text>
      </View>

      <View className="flex-row items-center mb-4">
        <Image
          source={{ uri: session.username_icon }}
          className="w-12 h-12 rounded-full border-2 border-[#222222]"
        />
        <View className="ml-4">
          <Text className="text-lg font-bold text-gray-800">{session.session_name}</Text>
          <Text className="text-sm text-gray-600">Created by {session.username}</Text>
        </View>
      </View>

      <Text className="text-gray-700">
        <FontAwesome name="calendar" size={14} color="gray" /> {formatDate(new Date(session.start_time), new Date(session.end_time))}
      </Text>
      <Text className="text-gray-700">
        <FontAwesome name="map-marker" size={14} color="gray" /> {session.location_name} ~ {(session.dis / 1609.34).toPrecision(1)} miles
      </Text>

    </View>
  );

  return (
    <GestureHandlerRootView className='my-1'>
      <Swipeable
        leftThreshold={100} // Slightly increase thresholds for intentional swipes
        rightThreshold={100}
        friction={2} // Smooth out swipe motion
        overshootFriction={8} // Lower overshoot friction for natural rebound
        renderLeftActions={LeftSwipeActions}
        renderRightActions={RightSwipeActions}
        onSwipeableOpenStartDrag={() => setSwipeDetected(true)}
        onSwipeableWillOpen={(direction) => {
          setSwipeDetected(true);
          direction === 'left' ? handleSwipeLeft() : handleSwipeRight();
        }}
        enabled={explore}
      >
        <TouchableHighlight
          activeOpacity={1}
          className=' rounded-full'
          onPress={() => { !swipeDetected && router.push("/joinSession/" + session.id) }}>
          {renderContent()}
        </TouchableHighlight>
      </Swipeable>
    </GestureHandlerRootView>
  );
}
