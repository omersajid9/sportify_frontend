import { Tabs, useSegments } from "expo-router";
import React from "react";
import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useAuth } from "../context/auth";
import PlusButton from "../../components/PlusButton";
import { AnimatePresence, MotiView } from "moti";
import Animated, { BounceIn, BounceOut } from "react-native-reanimated";

export default function Layout() {
  const { user } = useAuth();
  const segments = useSegments();

  const showPlus = segments[segments.length - 1] == "home"

  return (
    <>
      <Tabs>
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarActiveTintColor: 'rgb(30 58 138)',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome6 name="house-chimney-window" color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="index"
          options={{
            title: "Explore",
            headerShown: false,
            tabBarActiveTintColor: 'rgb(30 58 138)',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="search" color={color} size={size} />
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

      <AnimatePresence>
        {showPlus ? (
          <MotiView
            key="plusButton"
            from={{
              opacity: 0,
              scale: 0.8
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.8
            }}
            transition={{
              type: "spring",
              damping: 12,
              stiffness: 200
            }}
          >
            <PlusButton />
          </MotiView>
        ) : null}
      </AnimatePresence>
    </>
  );
}

