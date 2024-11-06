import React, { useEffect } from 'react';
import { ScrollView, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import SportIcon from './SportIcon';
import axiosInstance from '../services/api';
import Loader from './Loader';
import ErrorBanner from './ErrorBanner';

interface SportDateSelectorProps {
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
  selectedDate: String | Date;
  setSelectedDate: (date: string) => void;
  setFetchingSports: (bool: boolean) => void;
}


const useSports = () => {
  return useQuery({queryKey: ['sports'], queryFn: async () => {
    const response = await axiosInstance.get('/search/sports');
    return response.data; 
  }})
};

const formatDateString = (date: string) => {
  var datey = new Date(date);
  if (isNaN(datey.getTime())) {
    return date;
  }
  return datey.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}


export default function SportDateSelector({selectedSport, setSelectedSport, selectedDate, setSelectedDate, setFetchingSports}: SportDateSelectorProps) {
  var { data: sports, isLoading, error, refetch } = useSports();

  useEffect(() => {
    if (sports) {
      setFetchingSports(true);
    }
  }, [sports]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorBanner message='Failed to fetch sports' refetch={refetch} />
  }

  sports = [{name: "All", key: "all", icon: "genderless"}, ...sports.data.sports]

  function generateDatesAndDays(startDate = new Date()) {
    const result = [];

    result.push({date: "All", day: ""})
    


    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', "Sep", 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 20; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const formattedDate = currentDate.toDateString();
      const dayOfWeek = daysOfWeek[currentDate.getDay()];
      
      result.push({ date: formattedDate, day: dayOfWeek });
    }
    
    return result;
  }

  const dates = generateDatesAndDays();

  return (
    <View className="p-4">
      {/* Horizontal Scroll for Sports */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row mb-4"
      >
        {sports.map((sport: any) => (
          <TouchableOpacity
            key={sport.key}
            className={`flex-row items-center justify-between mx-1 px-4 py-2 rounded-lg ${
              selectedSport === sport.key ? 'bg-blue-900' : 'bg-gray-200'
            }`}
            onPress={() => setSelectedSport(sport.key)}
          >
            <SportIcon
              sport_icon={sport.icon}
              size={18}
              sport_icon_source={sport.icon_source}
              color={selectedSport === sport.key ? 'white' : 'black'} />
            <Text
              className={`ml-2 ${
                selectedSport === sport.key ? 'text-white' : 'text-black'
              }`}
            >
              {sport.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Horizontal Scroll for Dates */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {dates.map((date, index: any) => (
          <TouchableOpacity
            key={index}
            className={`flex justify-center items-center px-4 mx-1 py-2 rounded-lg ${
              selectedDate === date.date ? 'bg-blue-900' : 'bg-gray-200'
            }`}
            onPress={() => setSelectedDate(date.date.toString())}
          >
            {
              date.day && 
            <Text
              className={`${
                selectedDate === date.date ? 'text-white' : 'text-black'
              }`}
            >
              {date.day}
            </Text>
            }
            <Text
              className={`${
                selectedDate === date.date ? 'text-white' : 'text-black'
              }`}
            >
              {date.date == new Date().toDateString() ? "Today": formatDateString(date.date)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
