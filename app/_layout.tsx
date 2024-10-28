import { SplashScreen, Stack } from "expo-router";
import { Provider, useAuth } from "./context/auth";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from "react";
import "../global.css";

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
    if (!authInitialized && !user) return null;
    
    return (
        <QueryClientProvider client={queryClient} >
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <Stack>
                    <Stack.Screen
                        name="(tabs)"
                        options={{
                            title: "",
                            headerShown: false,
                        }} />
                    <Stack.Screen name="createSession" options={{ title: "Create a Session" }} />
                    <Stack.Screen name="joinSession/[id]" options={{ title: "Join Game" }} />
                    <Stack.Screen name="reportScore" options={{ title: "Report Score" }} />
                    <Stack.Screen name="profile/[user]" options={{ title: "", headerShown: false }} />
                    <Stack.Screen name="game/[id]" options={{ title: "" }} />
                </Stack>
            </SafeAreaView>
        </QueryClientProvider>

    );
}

