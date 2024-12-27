import React, { memo, useEffect, useMemo, useRef } from 'react';
import { ScrollView, TouchableOpacity, View, Text, ActivityIndicator, GestureResponderEvent, Animated, TouchableWithoutFeedback } from 'react-native';
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

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const formattedDate = currentDate.toDateString();
      const dayOfWeek = daysOfWeek[currentDate.getDay()];

      result.push({ date: formattedDate, day: dayOfWeek });
    }

    return result;
  }

  const dates = generateDatesAndDays()


  return (
    <View className="px-4 py-1 flex gap-1 h-[120px]  ">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row bg-transparent h-1/2"
      >
        <FlashList
          data={dates}
          horizontal
          estimatedItemSize={50}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <ScaleTouchable
              key={index}
              className={
                `flex-grow justify-center items-center px-4 m-1 py-1 rounded-lg ${selectedDate === item.date ? 'bg-[#222222]' : 'bg-[#e0e0e0]'}`
              }
              onPress={() => setSelectedDate(item.date.toString())}
              selectedVal={selectedDate}
              val={item.date}
            >
              <>
                <Text
                  className={
                    `font-semibold ${selectedDate === item.date ? 'text-[#F2F2F2]' : 'text-[#222222]'}`
                  }

                >
                  {item.day}
                </Text>
                {item.date !== 'All' && (
                  <Text
                    className={
                      `font-semibold ${selectedDate === item.date ? 'text-[#F2F2F2]' : 'text-[#222222]'}`
                    }
                  >
                    {item.date === new Date().toDateString()
                      ? 'Today'
                      : formatDateString(item.date)}
                  </Text>
                )}
              </>
            </ScaleTouchable>
          )}
        />

      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row bg-transparent h-1/2"
      >
        <FlashList
          data={sports}
          horizontal
          estimatedItemSize={30}
          showsHorizontalScrollIndicator={false}
          renderItem={(item: any) => (
            <ScaleTouchable
              key={item.item.key}
              className={` flex-row   gap-2 items-center justify-center m-1 mx-1.5 px-4 py-3 rounded-lg   ${selectedSport === item.item.key ? ' bg-[#222222]' : 'bg-[#e0e0e0]'
                }`}
              onPress={() => setSelectedSport(item.item.key)}
              selectedVal={selectedSport}
              val={item.item.key}
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
            </ScaleTouchable>

          )}
        />
      </ScrollView>


    </View>
  );
}



interface ScaleTouchableProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  scaleTo?: number;
  className?: string;
  val: string;
  selectedVal: String | Date;
}

export const ScaleTouchable: React.FC<ScaleTouchableProps> = ({
  val,
  selectedVal,
  children,
  onPress,
  scaleTo = 1.1,
  className = '',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: val === selectedVal ? scaleTo : 1,
      damping: 15,
      stiffness: 150,
      useNativeDriver: true,
    }).start();

    Animated.timing(opacityAnim, {
      toValue: val === selectedVal ? 1 : 0.6,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [val, selectedVal, scaleTo]);


  return (
    <TouchableWithoutFeedback
      onPress={onPress}
    >
      <Animated.View
        style={[{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}
        className={className}
      >
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};