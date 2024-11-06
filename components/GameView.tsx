import React, { useRef } from 'react';
import { View, Text, Image } from 'react-native';
import { GestureHandlerRootView, Swipeable, TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../app/context/auth';
import SportIcon from './SportIcon';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../services/api';

interface GameViewProps {
  gameData: any;
  explore: boolean;
}

export default function GameView({gameData, explore}: GameViewProps) {
  const {user} = useAuth();
  const flRef = useRef<any>(null);
  const queryClient = useQueryClient();

  var session = gameData.item;

  const handleSubmit = async (rsvp: String) => {
    const data = {
      session_id: session.id,
      player_username: user,
      player_rsvp: rsvp
    }
    try {
      const response = await axiosInstance.post('/session/rsvp', data, {
        headers: {
          'Content-Type': 'application/json', // Ensure the request is in JSON format
        }
      });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    } catch (error) {
      console.error('Error creating game:', error);
    }
  }

  const handleSwipeRight = () => {
    flRef?.current.setNativeProps({
      style: { display: 'none' }
    });
    handleSubmit("No")
  };

  const handleSwipeLeft = () => {
    flRef?.current.setNativeProps({
      style: { display: 'none' }
    });
    handleSubmit("Yes")
  };

  const LeftSwipeActions = () => {
    return (
      <View
        className=' mx-auto bg-green-500 justify-center align-middle w-full rounded-xl'
      >
        <Text
          className=' text-white px-10 font-bold p-30'
        >
          Going
        </Text>
      </View>
    )
  }

  const rightSwipeActions = () => {
    return (
      <View
        className=' mx-auto bg-red-500 justify-center align-middle w-full rounded-xl'
      >
        <Text
          className=' text-white px-10 font-bold p-30 self-end'
        >
          Not Going
        </Text>
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
    <View ref={flRef} className=" mx-auto bg-gray-50 w-full rounded-xl shadow-sm p-5 border border-gray-200">

      {/* Top Row with Game Type and Player Count */}
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <SportIcon
              sport_icon={session.sport_icon}
              size={16}
              sport_icon_source={session.sport_icon_source}
              color={'rgb(30 58 138)'} />
          <Text className="ml-2 text-gray-600">{session.sport}</Text>
        </View>
        <Text className="text-gray-700 text-sm font-semibold">
          {session.count_rsvps + 1}/{session.max_players} Attending
        </Text>
      </View>

      {/* Main Content Section */}
      <View className="flex-row items-center mb-4">
        {/* Profile Image */}
        <Image
          source={{ uri: session.username_icon }}
          className="w-12 h-12 rounded-full border-2 border-blue-900"
        />
        <View className="ml-4">
          <Text className="text-lg font-bold text-gray-800">{session.session_name}</Text>
          <Text className="text-sm text-gray-600">Created by {session.username}</Text>
        </View>
      </View>

      {/* Date, Time, Location */}
      <View className="mb-3">
        <Text className="text-gray-700">
          <FontAwesome name="calendar" size={14} color="gray" /> {formatDate(new Date(session.start_time), new Date(session.end_time))}
        </Text>
        <Text className="text-gray-700">
          <FontAwesome name="map-marker" size={14} color="gray" /> {session.location_name} ~ {(session.dis/ 1609.34).toPrecision(1)} miles
        </Text>
      </View>

      {/* Skill Level Tag */}
      {/* <View className="self-start bg-blue-100 px-3 py-1 rounded-full">
            <Text className="text-blue-700 text-xs">{session.skillLevel}</Text>
        </View> */}
    </View>
  );

  return (
    <GestureHandlerRootView className='my-1 mx-4'>
      <Swipeable
        leftThreshold={200}
        rightThreshold={100}
        renderLeftActions={LeftSwipeActions}
        renderRightActions={rightSwipeActions}
        onSwipeableOpen={(direction) => {
          direction === 'left' ? handleSwipeLeft() : handleSwipeRight()
        }}
        enabled={explore}
      >
        <TouchableOpacity
          onPress={() => router.push("/joinSession/" + session.id)}>
          {renderContent()}
        </TouchableOpacity>
      </Swipeable>
    </GestureHandlerRootView>
  );
}
