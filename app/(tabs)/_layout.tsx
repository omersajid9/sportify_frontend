import { Tabs } from "expo-router";
import React from "react";
import { FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useAuth } from "../context/auth";

export default function Layout() {
  const {user} = useAuth();
  if (!user) return null;
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "For You",
          headerShown: false,
          tabBarActiveTintColor: 'rgb(30 58 138)',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="house-chimney-window" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          headerShown: false,
          tabBarActiveTintColor: 'rgb(30 58 138)',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="users" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          headerShown: false,
          tabBarActiveTintColor: 'rgb(30 58 138)',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarActiveTintColor: 'rgb(30 58 138)',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

