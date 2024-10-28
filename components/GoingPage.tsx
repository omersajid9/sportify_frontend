import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import GameView from "./GameView";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useAuth } from "../app/context/auth";
import { BASE_URL } from "../app.config";

const getUpcomingGames = (user: string | null, location: { lat: number, lng: number }) => {
    return useQuery({
        queryKey: ['sessions', 'going', user], queryFn: async () => {
            const response = await axios.get(BASE_URL + '/search/going_sessions', { params: { username: user, lat: location.lat, lng: location.lng } });
            return response.data.data.sessions;
        }
    })
};

export default function GoingPage() {
    const { user, location } = useAuth();
    const Location = location ? location : { lat: 40, lng: -74 };

    var { data: sessions, isLoading, error, refetch } = getUpcomingGames(user, Location);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };


    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error fetching games {error.message}</Text>;
    }

    return (
        <View
            className="h-full">
            <GestureHandlerRootView>
                <FlashList
                    data={sessions}
                    renderItem={(item: any) => <GameView key={item.id} gameData={item} explore={false} />}
                    estimatedItemSize={200}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        isLoading ? (
                            <Text className="text-center mt-4 text-gray-500">Loading...</Text>
                        ) : (
                            <Text className="text-center mt-4 text-gray-500">No sessions found</Text>
                        )
                    }
                />
            </GestureHandlerRootView>
        </View>
    );
}