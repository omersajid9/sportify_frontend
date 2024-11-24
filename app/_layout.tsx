import { Stack, SplashScreen, router } from "expo-router";
import { Provider, useAuth } from "./context/auth";
// import * as SplashScreen from 'expo-splash-screen';


import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from "react";
import "../global.css";
import { usePushNotifications } from "../services/useNotifications";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

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
    if (!authInitialized) return null;

    // const unsubscribe = NetInfo.addEventListener(state => {
    //     console.log('Connection type', state.type);
    //     console.log('Is connected?', state.isConnected);
    //   });
      
    return (
        <QueryClientProvider client={queryClient} >
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <Stack>
                    <Stack.Screen
                        name="(tabs)"
                        options={{
                            title: "",
                            headerShown: false,
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
                    <Stack.Screen name="createSession" options={{ title: "Create a Session" }} />
                    <Stack.Screen  name="joinSession/[id]" options={{ title: "Join Session" }} />
                    <Stack.Screen  name="reportScore" options={{ title: "Report Score" }} />
                    <Stack.Screen  name="profile/[user]" options={{ title: "", headerShown: false }} />
                    <Stack.Screen  name="game/[id]" options={{ title: "Game Overview" }} />
                    <Stack.Screen  name="settings" options={{ title: "Settings" }} />
                    <Stack.Screen  name="authpage" options={{ title: "Auth Page" }} />
                    <Stack.Screen  name="notifications" options={{ title: "Notifications" }} />
                </Stack>
            </SafeAreaView>
        </QueryClientProvider>

    );
}


{/* <Stack.Screen name="(auth)" options={{ title: "" }} /> */}

