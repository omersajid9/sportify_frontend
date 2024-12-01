import { Stack, SplashScreen, router, useSegments } from "expo-router";
import { Provider, useAuth } from "./context/auth";
// import * as SplashScreen from 'expo-splash-screen';


import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from "react";
import "../global.css";
import { usePushNotifications } from "../services/useNotifications";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { SheetProvider } from "react-native-actions-sheet";
import '../components/ActionSheets'
import { HomeHeader, ProfileHeader } from "../components/Header";


const queryClient = new QueryClient();

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    SplashScreen.hideAsync();
    return (
        <Provider>
            <RootLayoutNav />
        </Provider>
    );
}

function RootLayoutNav() {
    const { authInitialized, user } = useAuth();
    const { expoPushToken } = usePushNotifications();
    const segments = useSegments();

    if (!authInitialized) return null;
    const showProfileHeader = !(segments[segments.length - 1] == "home" || segments[segments.length - 1] == "(tabs)")

    console.log(segments)
    function TabHeader() {
        if (showProfileHeader) {
            return (
                <ProfileHeader />
            )
        } else {
            return (
                <HomeHeader />
            )
        }
    }

    // const unsubscribe = NetInfo.addEventListener(state => {
    //     console.log('Connection type', state.type);
    //     console.log('Is connected?', state.isConnected);
    //   });

    return (
        <QueryClientProvider client={queryClient} >
            <SafeAreaView style={{ flex: 1, backgroundColor: '#F2F2F2' }} edges={['top']}>
                <SheetProvider>
                    <Stack>
                        <Stack.Screen
                            name="(tabs)"
                            options={{
                                title: "",
                                headerShown: false,
                                // headerRight: () => <TabHeader />,
                                // // headerTransparent: true,
                                // // headerBackground: 'transparent'
                                // headerStyle: { backgroundColor: '#F2F2F2' },
                                // headerShadowVisible: false,
                                // headerTintColor: '#222222',

                                // header: () => <Header />
                            }}
                        />
                        <Stack.Screen
                            name="(auth)"
                            options={{
                                title: "",
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen name="createSession" options={{ title: "Create a Session", headerTintColor: '#222222', headerStyle: { backgroundColor: '#F2F2F2' }, headerShadowVisible: false }} />
                        <Stack.Screen name="joinSession/[id]" options={{ title: "Join Session", headerTintColor: '#222222', headerStyle: { backgroundColor: '#F2F2F2' }, headerShadowVisible: false }} />
                        <Stack.Screen name="reportScore" options={{ title: "Report Score", headerTintColor: '#222222', headerStyle: { backgroundColor: '#F2F2F2' }, headerShadowVisible: false }} />
                        <Stack.Screen name="profile/[user]" options={{ title: "", headerShown: false, headerTintColor: '#222222', headerStyle: { backgroundColor: '#F2F2F2' }, headerShadowVisible: false }} />
                        <Stack.Screen name="game/[id]" options={{ title: "Game Overview", headerTintColor: '#222222', headerStyle: { backgroundColor: '#F2F2F2' }, headerShadowVisible: false }} />
                        <Stack.Screen name="settings" options={{ title: "Settings", headerTintColor: '#222222', headerStyle: { backgroundColor: '#F2F2F2' }, headerShadowVisible: false }} />
                        <Stack.Screen name="updateProfile" options={{ title: "Update Profile", headerTintColor: '#222222', headerStyle: { backgroundColor: '#F2F2F2' }, headerShadowVisible: false }} />
                        <Stack.Screen name="authpage" options={{ title: "Auth Page", headerTintColor: '#222222', headerStyle: { backgroundColor: '#F2F2F2' }, headerShadowVisible: false }} />
                        <Stack.Screen name="notifications" options={{ title: "Notifications", headerTintColor: '#222222', headerStyle: { backgroundColor: '#F2F2F2' }, headerShadowVisible: false }} />
                        <Stack.Screen
                            name="onboarding"
                            options={{
                                animation: 'slide_from_right',
                                animationDuration: 300,
                                headerStyle: { backgroundColor: '#F2F2F2' },
                                headerShadowVisible: false

                            }}
                        />
                    </Stack>
                </SheetProvider>
            </SafeAreaView>
        </QueryClientProvider>

    );
}


{/* <Stack.Screen name="(auth)" options={{ title: "" }} /> */ }

