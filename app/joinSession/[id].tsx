import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/auth';
import SportIcon from '../../components/SportIcon';
import { FontAwesome } from '@expo/vector-icons';
import axiosInstance from '../../services/api';
import Loader from '../../components/Loader';
import AuthWall from '../../components/AuthWall';

const getSession = (id: String, location: {lat: number, lng: number}) => {
  return useQuery({
    queryKey: ['session', id, location.lat, location.lng], queryFn: async () => {
      const response = await axiosInstance.get('/session/' + id, { params: { lat: location.lat, lng: location.lng } });
      return response.data.data.session;  // Assuming the response data is in the correct format
    }
  })
};

const getUsernames = (id: string, ready: boolean) => useQuery({
  queryKey: ['rsvp', 'usernames', id],
  queryFn: async () => {
    const response = await axiosInstance.get('/session/players', { params: { session_id: id } });
    return response.data.data.players;
  },
  enabled: !!id && ready
});

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


export default function joinSession() {
  const queryClient = useQueryClient();
  const { user, location } = useAuth();
  const Location = location ? location : { lat: 40, lng: -74 };

  const { id } = useLocalSearchParams();
  const sessionId = Array.isArray(id) ? id[0] : id;

  var { data: session, isLoading: sessionLoading, error: sessionError } = getSession(sessionId, Location);
  var { data: usernames, isLoading: usernamesLoading, error: usernamesError } = getUsernames(sessionId, session != undefined);
  const otherUsernames: string[] = usernames?.map((u: any) => u.username).filter((u: any) => u != session?.username);


  const handleSubmit = async (rsvp: String) => {
    if (!user) {
      return;
    }
    const data = {
      session_id: sessionId,
      player_user_id: user.id,
      player_rsvp: rsvp
    }

    console.log('data', data)

    try {
      const response = await axiosInstance.post('/session/rsvp', data, {
        headers: {
          'Content-Type': 'application/json', // Ensure the request is in JSON format
        }
      });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      router.navigate("/")
    } catch (error) {
      console.error('Error creating game:', error);
    }
  }

  if (sessionLoading || usernamesLoading) {
    return <Loader />;
  }

  if (sessionError) {
    return <Text>Error fetching session {sessionError.message}</Text>;
  }
  if (usernamesError) {
    return <Text>Error fetching usernames {usernamesError.message}</Text>;
  }

  return (
    <View className=" mx-auto bg-gray-50 w-full rounded-xl shadow-sm p-5 border border-gray-200">

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

      <View className="mb-3">
        <Text className="text-gray-700">
          <FontAwesome name="calendar" size={14} color="gray" /> {formatDate(new Date(session.start_time), new Date(session.end_time))}
        </Text>
        <Text className="text-gray-700">
          <FontAwesome name="map-marker" size={14} color="gray" /> {session.location_name} ~ {(session.dis / 1609.34).toPrecision(1)} miles
        </Text>
      </View>


      {otherUsernames.length > 0 &&
        <View className=' mx-2 rounded-lg'>
          <Text className=' text-lg font-bold text-gray-800'>RSVPS</Text>
          {otherUsernames.map((username: string) => (
            <Text key={username} className=' text-black p-2'>{username}</Text>
          ))}
        </View>      
      }

      {user && session?.username != user.username && otherUsernames.includes(user.username) == false &&
        <View className='flex-row justify-around my-2'>
          <TouchableOpacity onPress={() => handleSubmit("No")}>
            {/* <View className=' bg-red-300 py-2 px-4 rounded-lg'><Text>Reject</Text></View> */}
            <View className=' bg-red-300 py-2 px-4 rounded-lg'><Text>Reject</Text></View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSubmit("Yes")}>
            <View className=' bg-green-300 py-2 px-4 rounded-lg'><Text>Accept</Text></View>
          </TouchableOpacity>
        </View>
      }
      {!user &&
        <AuthWall />
      }



    </View>
  );
};
