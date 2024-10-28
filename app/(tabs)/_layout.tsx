import { Tabs } from "expo-router";
import React from "react";
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';

export default function Layout() {
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
