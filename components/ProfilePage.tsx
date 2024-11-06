// ProfileScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native';
import GamesPlayedView from './GamePlayedView';
import { useQuery } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import SportIcon from './SportIcon';
import axiosInstance from '../services/api';
import Loader from './Loader';
import ErrorBanner from './ErrorBanner';

const getUserProfile = (username: String | null) => {
  return useQuery({
    queryKey: ['user_profile', username], queryFn: async () => {
      const response = await axiosInstance.get('/player/profile', { params: { username: username } });
      return response.data.data;  // Assuming the response data is in the correct format
    }
  })
};

interface ProfileScreenProps {
  user: string | null;
}


export default function ProfileScreen({ user }: ProfileScreenProps) {
  const username = user;
  const { data: data, isLoading: gamesLoading, error: gamesError, refetch } = getUserProfile(username);
  const [refreshing, setRefreshing] = useState(false);

  const userInfo = data?.profile;
  const games = data?.games;
  const ratings = data?.ratings;

  if (gamesLoading) {
    return <Loader />;
  }

  if (gamesError) {
    return <ErrorBanner message='Error fetching profile' refetch={refetch} />;
  }


  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 p-4">
      <View className="mb-2 p-4 bg-transparent rounded-lg">
        <View className="flex-row items-center mb-2">
          <Image
            source={{ uri: userInfo.profile_picture }}
            className=" w-14 h-14 rounded-full border-2 border-blue-900 mr-4"
          />
          <View className="ml-4">
            <Text className="text-xl font-bold">{userInfo.username}</Text>
          </View>
        </View>
      </View>

      {ratings.length > 0 &&

        <View className='h-26 mb-4'>
          <FlatList
            data={ratings}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 2 }}
            keyExtractor={(item) => item.sport + '-' + item.mode}
            renderItem={({ item }) => (
              <View className="mr-4 p-3 bg-white rounded-lg justify-center">
                <View className="flex-row items-center mb-1">
                  <SportIcon
                    sport_icon={item.sport_icon}
                    sport_icon_source={item.sport_icon_source}
                    size={18}
                    color="rgb(30 58 138)"
                  />
                  <Text className="text-base font-bold mx-2">{item.sport}</Text>
                </View>
                <View className=' flex-row items-center mb-1 gap-2'>
                  <ModeIcon mode={item.mode} />
                    <Text className="text-2xl text-gray-500 font-bold text-center">{(item.rating).toFixed(2)}</Text>

                  </View>

              </View>
            )}
          />
        </View>
      }
      <GestureHandlerRootView className='flex-1 h-full'>
        <Text className="text-lg font-semibold mb-4">Scores</Text>
        <FlatList
          data={games}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GamesPlayedView key={item.id} game={item} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />

      </GestureHandlerRootView>
    </View>
  );
};

interface ModeIconProps {
  mode: String
}

function ModeIcon({mode}: ModeIconProps) {
  if (mode == 'single') {
    return (
      <Ionicons className='' name="person-outline" size={18} color="rgb(30 58 138)" />
    )
  } else {
    return (
      <Ionicons className='' name="people-outline" size={18} color="rgb(30 58 138)" />
    )
  }
}