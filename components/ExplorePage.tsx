
import { View, Text, RefreshControl, TouchableOpacity } from 'react-native';
import SportDateSelector, { ScaleTouchable } from './SportDateSelector';
import React, { useEffect, useState } from 'react';
import GameView from './GameView';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FlashList } from "@shopify/flash-list";
import { useAuth } from '../app/context/auth';
import GameMap from './GameMap';
import ReloadButton from './ReloadButton';
import { GOOGLE_PLACES_API_KEY } from '../app.config';
import GoogleSearchPlaces from './GoogleSearchPlaces';
import { reverseGeocodeAsync } from 'expo-location';
import axiosInstance from '../services/api';
import Loader from './Loader';
import ErrorBanner from './ErrorBanner';
import Feather from '@expo/vector-icons/Feather';

function formatDate(date: Date) {
    if (isNaN(date.getTime())) {
        return "null"
    }
    const year = date.getFullYear(); // Get the full year
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month (0-11) and pad with leading zero
    const day = String(date.getDate()).padStart(2, '0'); // Get the day and pad with leading zero

    return `${year}-${month}-${day}`; // Return the formatted date string
}

const getGames = (sport: string, date: string, user_id: string | undefined, lat: number, lon: number, ready: boolean) => {
    date = formatDate(new Date(date));

    return useQuery({
        queryKey: ['sessions', sport, date, user_id, lat, lon], queryFn: async () => {
            const response = await axiosInstance.get('/search/explore_sessions', { params: { user_id: user_id, lat: lat, lng: lon, sport: sport, date: (date == "null" ? null : date) } });
            return response.data.data.sessions;
        },
        enabled: ready
    })
};

interface Prediction {
    description: string;
    place_id: string;
}

export default function ExplorePage() {
    const [fetchingSports, setFetchingSports] = useState(false);

    const { user, location } = useAuth();
    const Location = location ? location : { lat: 40, lng: -74 };

    const [view, setView] = useState('list'); // or map

    const [selectedSport, setSelectedSport] = useState<string>('all');
    const [selectedDate, setSelectedDate] = useState<string>('All');

    const [region, setRegion] = useState({
        latitude: Location.lat,
        longitude: Location.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });
    const [mapRegion, setMapRegion] = useState({
        latitude: Location.lat,
        longitude: Location.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });

    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [query, setQuery] = useState("");
    const [queryPlaceholder, setQueryPlaceholder] = useState("Search Location");


    const getPlaceDetails = async (placeId: string) => {
        try {
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}`;
            const detailsResponse = await axios.get(detailsUrl);
            const { lat, lng } = await detailsResponse.data.result.geometry.location;
            setRegion({
                ...region,
                latitude: lat,
                longitude: lng,
            })
            setMapRegion({
                ...region,
                latitude: lat,
                longitude: lng,
            })
        } catch (error) {
            console.error('Error fetching place details:', error);
        }
    }

    const getCurrentLocation = () => {
        setRegion({
            ...region,
            latitude: Location.lat,
            longitude: Location.lng,
        })
        setMapRegion({
            ...region,
            latitude: Location.lat,
            longitude: Location.lng,
        })
    }

    var { data: games, isLoading, error, refetch } = getGames(selectedSport, selectedDate, user?.id, region.latitude, region.longitude, fetchingSports);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };


    const touchLocation = (index: number) => {
        // if (pre)
        getPlaceDetails(predictions[index].place_id);
        setQuery(predictions[index].description);
        setPredictions([]);
    }

    useEffect(() => {
        (async () => {
            try {
                const place = await reverseGeocodeAsync({
                    latitude: region.latitude,
                    longitude: region.longitude,
                });

                if (place.length > 0) {
                    var query = place[0].formattedAddress ? place[0].formattedAddress : place[0].name + ", " + place[0].city + " " + place[0].postalCode + ", " + place[0].isoCountryCode;
                    if (query) {
                        setQuery("");
                        setQueryPlaceholder(query);
                    }
                } else {
                    setQuery("");
                    setQueryPlaceholder("Search Location");
                }
            } catch (e) {

            }
        })();
    }, [region.latitude])


    return (
        <View className=" flex-1 h-full">
            <SportDateSelector
                selectedSport={selectedSport}
                setSelectedSport={setSelectedSport}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                setFetchingSports={setFetchingSports}
            />

            <View className='flex-row justify-between mb-2 h-10'>
                <View className='flex flex-grow bg-[#F2F2F2] shadow-sm rounded-lg mx-4 align-middle border-2 border-[#222222] ' >
                    <GoogleSearchPlaces setPredictions={setPredictions} query={query} setQuery={setQuery} placeholder={queryPlaceholder} refreshLocation={getCurrentLocation} />
                </View>
                <View className="flex-row gap-1 items-center justify-center mr-4">
                    <ScaleTouchable
                        className={`px-4 py-1 rounded-lg h-full items-center justify-center ${view === 'list' ? 'bg-[#222222] ' : 'bg-[#e0e0e0] '
                            }`}
                        onPress={() => setView('list')}
                        selectedVal={view}
                        val={'list'}
                    >
                        <Feather name="list" size={24} color={view== 'list' ? '#F2F2F2' : "#222222"} />
                        {/* <Text className={`font-semibold ${view === 'list' ? 'text-[#F2F2F2]' : 'text-[#222222]'}`}>List</Text> */}

                    </ScaleTouchable>
                    <ScaleTouchable
                        className={`px-4 py-1 rounded-lg h-full items-center justify-center ${view === 'map' ? 'bg-[#222222] ' : 'bg-[#e0e0e0] '
                            }`}
                        onPress={() => setView('map')}
                        selectedVal={view}
                        val={'map'}
                    >
                        <Feather name="map" size={24} color={view== 'map' ? '#F2F2F2' : "#222222"} />
                        {/* <Text className={`font-semibold ${view === 'map' ? 'text-[#F2F2F2]' : 'text-[#222222]'}`}>Map</Text> */}
                    </ScaleTouchable>
                </View>
            </View>

            {isLoading && view === 'list' ?
                <Loader />
                : error ?
                    <ErrorBanner message='Failed to fetch sessions' refetch={refetch} />
                    : predictions.length != 0 ?
                        <View className="flex-1 mx-2 rounded-lg">
                            <FlashList
                                estimatedItemSize={20}
                                data={predictions}
                                renderItem={(item: any) => (
                                    <TouchableOpacity onPress={() => touchLocation(item.index)}>
                                        <View className="p-4 mb-1 border-gray-20 rounded-lg w-full bg-white shadow-sm" >
                                            <Text className="text-black">
                                                {item.item.description}
                                            </Text>
                                        </View>

                                    </TouchableOpacity>
                                )}

                            />
                        </View>
                        :
                        view === 'list' ?
                            <FlashList
                            className=' mx-4'
                                // style={{ flex: 1 }}
                                data={games}
                                renderItem={(item: any) => <GameView key={item.id} gameData={item} explore={true} />}
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
                            :
                            <View className='flex-1 mx-2'>
                                <GameMap games={games} region={mapRegion} setRegion={setMapRegion} />
                                <ReloadButton reload={() => { setRegion(mapRegion); onRefresh(); }} />
                            </View>
            }




        </View>
    )
}
