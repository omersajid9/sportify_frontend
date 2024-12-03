// import { router, Stack, Tabs, useSegments } from "expo-router";
// import React from "react";
import { Feather, FontAwesome, FontAwesome5, FontAwesome6, Ionicons, Octicons } from '@expo/vector-icons';
// import { useAuth } from "../context/auth";
// import PlusButton from "../../components/PlusButton";
// import { AnimatePresence, MotiView } from "moti";
// import Animated, { BounceIn, BounceOut } from "react-native-reanimated";
// import { View, Text } from 'react-native'

// export default function Layout() {
//   const { user } = useAuth();
//   const segments = useSegments();

//   // const showPlus = segments[segments.length - 1] == "home" || segments[segments.length - 1] == "(tabs)"

//   const [selectedTab, setSelectedTab] = useState<string>('home'); // State to track selected tab

//   function TabHeader() {
//     if (selectedTab == 'user') {
//       return (
//         <ProfileHeader />
//       )
//     } else {
//       return (
//         <HomeHeader />
//       )
//     }
//   }

//   var title = ""
//   if (selectedTab == 'user') {
//     title = "Profile"
//   } else if (selectedTab == 'home') {
//     title = "Home"
//   } else if (selectedTab == 'activity') {
//     title = "Activity"
//   } else {
//     title = "Explore"
//   }



//   return (
//     <>
//       <Stack.Screen
//         options={{
//           title: title,
//           headerShown: true,
//           headerRight: () => <TabHeader />,
//           headerStyle: { backgroundColor: '#F2F2F2' },
//           headerShadowVisible: false,
//           headerTintColor: '#222222',

//         }}
//       />

//       <AnimatePresence>
//         {selectedTab == 'home' ?
//           <Home />
//           :
//           selectedTab == 'activity' ?
//             <Activity />
//             :
//             selectedTab == 'search' ?
//               <ExplorePage />
//               :
//               <Profile />
//         }
//       </AnimatePresence>
//       <View className=" mx-auto mb-5 bg-[#F2F2F2] rounded-3xl border-4 border-[#222222] shadow-lg">
//         <BottomTabView selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
//       </View>
//     </>
//   );
// }



// import { TouchableOpacity } from 'react-native';
// import { useState } from 'react';
// import Home from "./home";
// import Profile from "./profile";
// import ExplorePage from "../../components/ExplorePage";
// import { HomeHeader, ProfileHeader } from "../../components/Header";
// import Activity from "./activity";

// function BottomTabView({ selectedTab, setSelectedTab }: { selectedTab: string, setSelectedTab: (selectedTab: string) => void }) {

//   const tabs = [
//     { key: 'home', icon: () => <Octicons name="home" size={25} color="#222222" />, route: '/' },
//     { key: 'activity', icon: () => <Feather name="activity" size={25} color="#222222" />, route: '/createSession' },
//     { key: 'search', icon: () => <Octicons name="search" color={'#222222'} size={25} />, route: '/' },
//     { key: 'user', icon: () => <Octicons name="person" color={'#222222'} size={25} />, route: '/profile' },
//   ];


//   return (
//     <View className="flex-row justify-between items-center gap-2 py-2 px-3">
//       {tabs.map(({ key, icon: Icon, route }) => (
//         <TouchableOpacity key={key} onPress={() => setSelectedTab(key)} className="flex items-center">
//           <MotiView
//             style={{
//               width: 45,
//               height: 45,

//               backgroundColor: selectedTab === key ? '#e0e0e0' : 'transparent', // Light gray

//             }}
//             animate={{
//               scale: selectedTab === key ? 1.2 : 1,
//               opacity: selectedTab === key ? 1 : 0.6,
//             }}
//             transition={{
//               type: 'spring',
//               damping: 15,
//               stiffness: 150,
//             }}
//             className="flex items-center justify-center  px-3 rounded-2xl py-1 shadow-sm"
//           >
//             <Icon />
//           </MotiView>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// };




import React, { useState } from "react";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { Tabs as TabRouter } from 'expo-router';
import { View, Text, TouchableOpacity } from "react-native";
// import { Octicons, Feather } from "@expo/vector-icons";
import { AnimatePresence, MotiView } from "moti";
import Home from "./home";
import Profile from "./profile";
import ExplorePage from "../../components/ExplorePage";
import { HomeHeader, ProfileHeader } from "../../components/Header";
import Activity from "./activity";

export default function Layout() {
  const [selectedTab, setSelectedTab] = useState<string>("home");

  // function TabHeader() {
  //   if (selectedTab === "user") {
  //     return <ProfileHeader />;
  //   } else {
  //     return <HomeHeader />;
  //   }
  // }

  // const titleMap: { [key: string]: string } = {
  //   user: "Profile",
  //   home: "Home",
  //   activity: "Activity",
  //   search: "Explore",
  // };

  // const renderContent = () => {
  //   switch (selectedTab) {
  //     case "home":
  //       return <Home />;
  //     case "activity":
  //       return <Activity />;
  //     case "search":
  //       return <ExplorePage />;
  //     case "user":
  //       return <Profile />;
  //     default:
  //       return null;
  //   }
  // };

  const tabs = [
    { key: 'index', icon: () => <Octicons name="home" size={25} color="#222222" />, route: '/home' },
    { key: 'activity', icon: () => <Feather name="activity" size={25} color="#222222" />, route: '/activity' },
    { key: 'home', icon: () => <Octicons name="search" color={'#222222'} size={25} />, route: '/' },
    { key: 'user', icon: () => <Octicons name="person" color={'#222222'} size={25} />, route: '/profile' },
  ];


  return (
    <>
      <Tabs>
        <TabSlot
        />
        <TabList asChild>
          <View className="mx-auto mb-5 bg-[#F2F2F2] rounded-3xl border-4 border-[#222222] shadow-lg flex-row justify-between items-center gap-2 py-2 px-3">
            {tabs.map(({ key, icon: Icon, route }) => (
              <TabTrigger
                key={key}
                name={key}
                href={route}
                asChild
                onPress={() => setSelectedTab(key)}
              >
                <TouchableOpacity
                  className="flex items-center justify-center  px-3 rounded-2xl py-1 shadow-sm"
                  style={{
                    width: 45,
                    height: 45,
                    backgroundColor: selectedTab === key ? '#e0e0e0' : 'transparent', // Light gray
                  }}
                >
                  {/* <AnimatePresence>
                    <MotiView
                      style={{
                        width: 45,
                        height: 45,
                        backgroundColor: selectedTab === key ? '#e0e0e0' : 'transparent', // Light gray
                      }}
                      animate={{
                        scale: selectedTab === key ? 1.2 : 1,
                        opacity: selectedTab === key ? 1 : 0.6,
                      }}
                      transition={{
                        type: 'spring',
                        damping: 15,
                        stiffness: 150,
                      }}
                      className="flex items-center justify-center  px-3 rounded-2xl py-1 shadow-sm"
                    > */}

                      <Icon />
                    {/* </MotiView>
                  </AnimatePresence> */}
                </TouchableOpacity>
              </TabTrigger>
            ))}
          </View>
        </TabList>
      </Tabs>
      {/* <AnimatePresence>{renderContent()}</AnimatePresence> */}
    </>
  );
}
