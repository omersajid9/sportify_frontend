import { Feather, FontAwesome, FontAwesome6, Ionicons, Octicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { View, Animated, Text } from "react-native";

export default function Layout() {
  const tab_image_size = 40;
  var tab_selected = 'home';
  const segments = useSegments();
  if (segments[segments.length-1] == 'profile') {
    tab_selected = 'profile';
  } else if (segments[segments.length-1] == 'home') {
    tab_selected = 'calender';
  }
  const [selectedTab, setSelectedTab] = useState<string>(tab_selected);

  const tabs = [
    { key: 'home', icon: () => <Octicons name="home" color={'#222222'} size={tab_image_size} />, route: '/', name: 'Home', width: 'w-13' },
    { key: 'calender', icon: () => <Octicons name="calendar" size={tab_image_size} color="#222222" />, route: '/home', name: 'Calendar', width: 'w-19' },
    { key: 'profile', icon: () => <Octicons name="person" color={'#222222'} size={tab_image_size} />, route: '/profile', name: 'Profile', width: 'w-15' },
  ];

  let activity = { key: 'activity', icon: () => <Octicons name="plus" size={tab_image_size} color="#222222" />, route: '/activity', name: 'Activity' };

  return (
    <>
      <Tabs className=''>
        <TabSlot
        />
        <TabList asChild>
          <View className="mx-auto mb-5 bg-[#f2f2f2] rounded-3xl border-4 border-[#f2f2f2] shadow-lg flex-row  items-center py-3 px-6 w-3/4">
            {tabs.map(({ key, icon: Icon, route, name, width }) => (
              <TabTrigger
                key={key}
                name={key}
                href={route}
                onPress={() => {
                  // time out
                  setSelectedTab(key);
                }}
                asChild
              >
                <TabButton
                  val={key}
                  name={name}
                  width={width}
                  selectedVal={selectedTab}
                  onPress={() => { }}
                >
                  <View className='flex flex-row gap-1 items-center w-fit'>
                    <Icon />
                    {key === selectedTab &&
                      <Text className="whitespace-nowrap overflow-hidden text-ellipsis text-[#222222] text-lg font-bold">{name}</Text>
                    }

                  </View>

                </TabButton>
              </TabTrigger>
            ))}
            <View className='flex flex-row items-center gap-3 '>
              {/* <Octicons name="dot-fill" size={12} color="black" /> */}
              <Feather name="more-vertical" size={24} color="black" />
              <PlusButton />
              {/* <Octicons name="plus" size={35} color="#222222" /> */}
            </View>
            {/* <View className="h-full border-2 border-dotted"  /> */}
          </View>
        </TabList>

      </Tabs>
    </>
  );
}


import { TabTriggerSlotProps } from 'expo-router/ui';
import { ComponentProps, Ref, forwardRef } from 'react';
import { Pressable } from 'react-native';
import { router, useSegments } from 'expo-router';
import PlusButton from '../../components/PlusButton';

type Icon = ComponentProps<typeof FontAwesome>['name'];

export type TabButtonProps = TabTriggerSlotProps & {
  icon?: Icon;
  name: string;
  width: string;
  val: string;
  selectedVal: string;
  onPress: (e: string) => void
};

export const TabButton = forwardRef(
  ({ icon, val, selectedVal, onPress, children, name, width, isFocused, ...props }: TabButtonProps, ref: Ref<View>) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
      Animated.spring(scaleAnim, {
        toValue: val == selectedVal ? 1.0 : 0.7,
        damping: 15,
        stiffness: 150,
        useNativeDriver: true,
      }).start();

      Animated.timing(opacityAnim, {
        toValue: val == selectedVal ? 0.9 : 0.7,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, [val, selectedVal]);

    return (
      <Pressable
        onPress={onPress}
      >
        <Animated.View
          style={[{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}
          className={`flex items-center justify-center rounded-2xl  ${val == 'activity' ? ' ' : ''}  ${val === selectedVal ? ' ' : 'bg-transparent '
            }`}
        >
          {children}

        </Animated.View>
      </Pressable>
    );
  }
);
