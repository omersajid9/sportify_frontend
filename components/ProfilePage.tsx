// ProfileScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native';
import GamesPlayedView from './GamePlayedView';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from '../app/context/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SportIcon from './SportIcon';
import { BASE_URL } from '../app.config';

const getUserProfile = (username: String | null) => {
  return useQuery({
    queryKey: ['user_profile', username], queryFn: async () => {
      const response = await axios.get(BASE_URL + '/player/profile', { params: { username: username } });
      return response.data.data;  // Assuming the response data is in the correct format
    }
  })
};

interface ProfileScreenProps {
  user: string | null;
  visit: boolean;
}


export default function ProfileScreen({ user, visit }: ProfileScreenProps) {

  const { signOut } = useAuth();
  const username = user;
  const { data: data, isLoading: gamesLoading, error: gamesError, refetch } = getUserProfile(username);
  const [refreshing, setRefreshing] = useState(false);

  const userInfo = data?.profile;
  const games = data?.games;
  const ratings = data?.ratings;

  if (gamesLoading) {
    return <Text>Loading...</Text>;
  }

  if (gamesError) {
    return <Text>Error fetching games {gamesError.message}</Text>;
  }


  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 p-4">
      <View className="flex-row justify-end">
        {visit ? null :
          <TouchableOpacity onPress={signOut}>
            <MaterialCommunityIcons
              name="logout"
              size={24}
              color="rgb(30 58 138)"
              style={{ transform: [{ scaleX: -1 }] }}  // Flip across Y-axis
            />
          </TouchableOpacity>
        }
      </View>
      <View className="mb-6 p-4 bg-transparent rounded-lg">
        <View className="flex-row items-center mb-4">
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

        <View className='h-20 mb-4'>
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
                  <Text className="text-base font-bold ml-2">{item.sport} ({item.mode})</Text>
                </View>
                <Text className="text-2xl text-gray-500 font-bold">{(item.rating).toFixed(2)}</Text>
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
