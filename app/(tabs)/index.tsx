import React from 'react';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ExplorePage from '../../components/ExplorePage';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import PlusButton from '../../components/PlusButton';
import GoingPage from '../../components/GoingPage';
import CommunityPage from '../../components/community';
import { useAuth } from '../context/auth';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'
import { HomeHeader } from '../../components/Header';

// import { NavigationContainer } from '@react-navigation/native';

// const Tab = createMaterialTopTabNavigator();

export default function MyTabs() {
  return (
    <View className='flex-1'>
      <ExplorePage />
      {/* <Tab.Navigator
        screenOptions={{
          lazy: true,
          tabBarContentContainerStyle: {
            alignItems: 'center',
            justifyContent: 'space-around',
          },
          tabBarIndicatorStyle: {
            display: 'none',
          },
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' }, // Slightly larger and bolder text for better readability
          tabBarItemStyle: { flex: 1 }, // Use flex to evenly distribute items
          tabBarActiveTintColor: 'rgb(34 34 34)', // Active tab color
          tabBarInactiveTintColor: 'gray', // Inactive tab color  
        }}
        >
        <Tab.Screen
          name="Explore"
          component={ExplorePage}/>
        <Tab.Screen
          name="Going"
          component={GoingPage}/>
      </Tab.Navigator> */}
      {/* <PlusButton /> */}

    </View>
  );
}

