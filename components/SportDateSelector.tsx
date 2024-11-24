import React, { useEffect } from 'react';
import { ScrollView, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import SportIcon from './SportIcon';
import axiosInstance from '../services/api';
import Loader from './Loader';
import ErrorBanner from './ErrorBanner';
import { FlashList } from '@shopify/flash-list';

interface SportDateSelectorProps {
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
  selectedDate: String | Date;
  setSelectedDate: (date: string) => void;
  setFetchingSports: (bool: boolean) => void;
}


const useSports = () => {
  return useQuery({
    queryKey: ['sports'], queryFn: async () => {
      const response = await axiosInstance.get('/search/sports');
      return response.data;
    }
  })
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


export default function SportDateSelector({ selectedSport, setSelectedSport, selectedDate, setSelectedDate, setFetchingSports }: SportDateSelectorProps) {
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

  sports = [{ name: "All", key: "all", icon: "genderless" }, ...sports.data.sports]

  function generateDatesAndDays(startDate = new Date()) {
    const result = [];

    result.push({ date: "All", day: "All" })



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
    <View className="p-4 flex gap-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row bg-transparent"
      >
        <FlashList
          data={dates}
          horizontal
          estimatedItemSize={50}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              className={`flex-grow justify-center items-center px-4 mx-1 py-2 rounded-lg border-2 ${selectedDate === item.date ? 'bg-blue-100 border-blue-900' : 'bg-neutral-100 border-neutral-200'
                }`}
              onPress={() => setSelectedDate(item.date.toString())}
            >
                <Text
                  className={`font-semibold ${selectedDate === item.date ? 'text-blue-900' : 'text-black'
                    }`}
                >
                  {item.day}
                </Text>
              {item.date != 'All' &&
                <Text
                  className={` ${selectedDate === item.date ? 'text-blue-900' : 'text-black'
                    }`}
                >
                  {item.date === new Date().toDateString() ? "Today" : formatDateString(item.date)}
                </Text>
              }
            </TouchableOpacity>
          )}
        />

      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row bg-transparent"
      >
        <FlashList
          data={sports}
          horizontal
          estimatedItemSize={50}
          showsHorizontalScrollIndicator={false}
          renderItem={(item: any) => (
            <TouchableOpacity
              key={item.item.key}
              className={` flex-col flex-grow gap-2 items-center justify-center mx-1 px-4 py-3 rounded-lg border-2 ${selectedSport === item.item.key ? 'bg-blue-100 border-blue-900' : 'bg-neutral-100 border-neutral-200'
                }`}
              onPress={() => setSelectedSport(item.item.key)}
            >
              <SportIcon
                sport_icon={item.item.icon}
                size={30}
                sport_icon_source={item.item.icon_source}
                color={selectedSport === item.item.key ? '#1e3a8a' : 'black'} />
              <Text
                className={` font-semibold ${selectedSport === item.item.key ? 'text-blue-900' : 'text-black'
                  }`}
              >
                {item.item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </ScrollView>


    </View>
  );
}
