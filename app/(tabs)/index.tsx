import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ExplorePage from '../../components/ExplorePage';
import { View, Text } from 'react-native';
import PlusButton from '../../components/PlusButton';
import GoingPage from '../../components/GoingPage';
import CommunityPage from './community';

const Tab = createMaterialTopTabNavigator();

export default function MyTabs() {
  return (
    <View className='flex-1 bg-black'>
      <Tab.Navigator
        screenOptions={{
          tabBarContentContainerStyle: {
            alignItems: 'center',
            justifyContent: 'space-around',
          },
          tabBarIndicatorStyle: {
            display: 'none',
          },
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' }, // Slightly larger and bolder text for better readability
          tabBarItemStyle: { flex: 1 }, // Use flex to evenly distribute items
          tabBarActiveTintColor: 'rgb(30 58 138)', // Active tab color
          tabBarInactiveTintColor: 'gray', // Inactive tab color  
        }}>
        <Tab.Screen
          key={1}
          name="Explore"
          component={ExplorePage}
          options={{ title: 'Explore' }}
        />
        <Tab.Screen
          key={2}
          name="Going"
          component={GoingPage}
          options={{ title: 'Going' }}
        />
      </Tab.Navigator>
      <PlusButton />
    </View>
  );
}

