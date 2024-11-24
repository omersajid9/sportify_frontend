import { View, Text, RefreshControl } from 'react-native';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './context/auth';
import { FlashList } from '@shopify/flash-list';
import axiosInstance from '../services/api';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import AuthWall from '../components/AuthWall';

const fetchNotifications = (user: string | null) => {
  return useQuery({
    queryKey: ['players', user], queryFn: async () => {
      const response = await axiosInstance.get('/notification/get', { params: { username: user } });
      return response.data.data.notifications;
    },
    enabled: true
  })
};

export default function Notifications() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const { data: notifications, isLoading, refetch } = fetchNotifications(user);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (!user) {
    return <AuthWall />
}

  return (
    <View className='h-full p-4'>
      <FlashList
        className='h-full'
        data={notifications}
        estimatedItemSize={50}
        renderItem={(item: any) => {
          return (
            <NotificationCard message={item.item.message} game_type={item.item.channel} />
          )
        }}
        keyExtractor={(item: any) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <Text className="text-center mt-4 text-gray-500">Loading...</Text>
          ) : (
            <Text className="text-center mt-4 text-gray-500">No notifications found</Text>
          )
        }
      />
    </View>
  )
}

interface NotificationCardProps {
  message: String;
  game_type: String;
}
function NotificationCard({ message, game_type}: NotificationCardProps) {
  return (
    <View className="bg-white p-4 mb-2 rounded-lg shadow-sm flex-row items-center gap-2 w-full">
      <NotificationIcon game_type={game_type} />
      <View className=' w-max flex-1'>
      <Text className="  text-gray-900 text-wrap">{message}</Text>
      </View>
    </View>
  )

}

interface NotificationIconProps {
  game_type: String;
}
function NotificationIcon({ game_type }: NotificationIconProps) {
  // console.log(game_type)
  if (game_type == "game") {
    return (
      <MaterialIcons name="scoreboard" size={24} color="rgb(30 58 138)" />
    )
  } else {
    return (
      <FontAwesome6 name="people-group" size={24} color="rgb(30 58 138)" />

    )
  }
}