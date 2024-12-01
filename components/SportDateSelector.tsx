import React, { useEffect } from 'react';
import { ScrollView, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import SportIcon from './SportIcon';
import axiosInstance from '../services/api';
import Loader from './Loader';
import ErrorBanner from './ErrorBanner';
import { FlashList } from '@shopify/flash-list';
import { MotiView } from 'moti';

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

    for (let i = 0; i < 10; i++) {
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
              // className={`flex-grow justify-center items-center px-4 mx-1 py-2 rounded-lg border-2 ${selectedDate === item.date ? 'bg-[#e0e0e0] border-[#222222]' : 'bg-transparent border-neutral-200'
              //   }`}
              onPress={() => setSelectedDate(item.date.toString())}
            >
              <MotiView
                style={{
                  backgroundColor: selectedDate === item.date ? '#222222' : '#e0e0e0', // Light gray
                  margin: 5
                }}
                animate={{
                  scale: selectedDate === item.date ? 1.1 : 1,
                  opacity: selectedDate === item.date ? 1 : 0.6,
                }}
                transition={{
                  type: 'spring',
                  damping: 15,
                  stiffness: 500,
                }}
                className=" flex-grow items-center justify-center px-4 py-3 rounded-lg"
              >
                <Text
                  className={`font-semibold ${selectedDate === item.date ? 'text-[#F2F2F2]' : 'text-[#222222]'
                    }`}
                >
                  {item.day}
                </Text>
                {item.date != 'All' &&
                  <Text
                    className={` ${selectedDate === item.date ? 'text-[#F2F2F2]' : 'text-[#222222]'
                      }`}
                  >
                    {item.date === new Date().toDateString() ? "Today" : formatDateString(item.date)}
                  </Text>
                }
              </MotiView>
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
          // className='flex flex-row gap-10'
          horizontal
          estimatedItemSize={50}
          showsHorizontalScrollIndicator={false}
          renderItem={(item: any) => (
            <TouchableOpacity
              key={item.item.key}
              // className={` flex-row flex-grow  gap-2 items-center justify-center mx-1 px-4 py-3 rounded-lg   ${selectedSport === item.item.key ? ' bg-[#222222] border-[#222222]' : 'bg-[#e0e0e0] border-neutral-200'
              // }`}
              onPress={() => setSelectedSport(item.item.key)}
            >
              <MotiView
                style={{
                  backgroundColor: selectedSport === item.item.key ? '#222222' : '#e0e0e0', // Light gray
                  margin: 5
                }}
                animate={{
                  scale: selectedSport === item.item.key ? 1.1 : 1,
                  opacity: selectedSport === item.item.key ? 1 : 0.6,
                }}
                transition={{
                  type: 'spring',
                  damping: 15,
                  stiffness: 500,
                }}
                className="flex-row gap-2 items-center justify-center px-4 py-3 rounded-lg"
              >
                <SportIcon
                  sport_icon={item.item.icon}
                  size={20}
                  sport_icon_source={item.item.icon_source}
                  color={selectedSport === item.item.key ? '#F2F2F2' : '#222222'} />
                <Text
                  className={` font-semibold ${selectedSport === item.item.key ? 'text-[#F2F2F2]' : 'text-[#222222]'
                    }`}
                >
                  {item.item.name}
                </Text>
              </MotiView>
            </TouchableOpacity>
          )}
        />
      </ScrollView>


    </View>
  );
}
