import React, { useState } from 'react';
import { View, Text, FlatList, Image, RefreshControl } from 'react-native';
import GamesPlayedView from './GamePlayedView';
import { useQuery } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import SportIcon from './SportIcon';
import axiosInstance from '../services/api';
import Loader from './Loader';
import ErrorBanner from './ErrorBanner';
import { FlashList } from '@shopify/flash-list';

interface User {
  id: string;
  username: string;
  profile_picture: string;
}

interface Rating {
  sport: string;
  sport_icon: string;
  sport_icon_source: string;
  mode: string;
  rating: number;
}

interface ProfileData {
  profile: any;
  games: any[];
  ratings: Rating[];
}

export const getUserProfile = (user_id: string | undefined) => {
  return useQuery({
    queryKey: ['user_profile', user_id], 
    queryFn: async () => {
      const response = await axiosInstance.get('/player/profile', { 
        params: { user_id: user_id } 
      });
      return response.data.data as ProfileData;
    }
  });
};

interface ProfileScreenProps {
  user: User;
}

interface ModeIconProps {
  mode: string;
}

function ModeIcon({ mode }: ModeIconProps) {
  if (mode === 'single') {
    return <Ionicons name="person-outline" size={18} color="rgb(30 58 138)" />;
  }
  return <Ionicons name="people-outline" size={18} color="rgb(30 58 138)" />;
}

export default function ProfileScreen({ user }: ProfileScreenProps) {
  const { data, isLoading, error, refetch } = getUserProfile(user?.id);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (error) {
      return <ErrorBanner message='Error fetching profile' refetch={refetch} />;
    }

    return (
      <>
        {data?.ratings && data.ratings.length > 0 && (
          <View className='h-26 my-5'>
            <FlatList
              data={data.ratings}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 2 }}
              keyExtractor={(item) => `${item.sport}-${item.mode}`}
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
                  <View className='flex-row items-center mb-1 gap-2'>
                    <ModeIcon mode={item.mode} />
                    <Text className="text-2xl text-gray-500 font-bold text-center">
                      {item.rating.toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        )}
        
        <GestureHandlerRootView className='flex-1 h-full'>
          <Text className="text-lg font-semibold mb-4">Games</Text>
          <FlashList
            estimatedItemSize={200}
            data={data?.games || []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <GamesPlayedView game={item} />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <Text className="text-center mt-4 text-gray-500">No games found</Text>
            }
          />
        </GestureHandlerRootView>
      </>
    );
  };

  return (
    <View className="flex-1 px-4 py-3">
      <View className="bg-transparent rounded-lg justify-center items-center">
        <View className="flex-col items-center justify-center gap-3">
          <Image
            source={{ uri: user.profile_picture }}
            className="w-20 h-20 rounded-full border-2 border-blue-900"
          />
          <View>
            <Text className="text-xl font-bold">{user.username}</Text>
          </View>
        </View>
      </View>

      {renderContent()}
    </View>
  );
}