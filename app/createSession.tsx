import { View, Text, Platform, Switch, TouchableOpacity, Pressable, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';

import { Picker } from '@react-native-picker/picker';
import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import axios from 'axios';
import { router } from 'expo-router';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import MapView, { Marker } from 'react-native-maps';

import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";

import { reverseGeocodeAsync } from 'expo-location';
import { useAuth } from './context/auth';
import { GOOGLE_PLACES_API_KEY } from '../app.config';
import GoogleSearchPlaces from '../components/GoogleSearchPlaces';
import { FlashList } from '@shopify/flash-list';
import axiosInstance from '../services/api';
import Loader from '../components/Loader';
import ErrorBanner from '../components/ErrorBanner';

const useSports = () => {
    return useQuery({
        queryKey: ['sports', 'all'], queryFn: async () => {
            const response = await axiosInstance.get('/search/sports');
            return response.data.data.sports;  // Assuming the response data is in the correct format
        }
    })
};

interface Prediction {
    description: string;
    place_id: string;
}


export default function CreateSession() {
    const queryClient = useQueryClient();

    const { user, location } = useAuth();
    const Location = location ? location : { lat: 40, lng: -74 };


    const [sessionName, setSessionName] = useState('');
    const [locationName, setLocationName] = useState('');

    const [dateTime, setDateTime] = useState(new Date());
    const [durationTime, setDurationTime] = useState(new Date("2021-01-01T00:30:00"));


    const extractDurationTime = (date: Date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return { hours, minutes };
    };


    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());

    const showDatePicker = () => {
        DateTimePickerAndroid.open({
            value: date,
            onChange: (event: any, selectedDate: any) => {
                if (event.type === 'set') {
                    setDate(selectedDate);
                }
            },
            mode: 'date',
            is24Hour: true,
        });
    };

    const showTimePicker = () => {
        DateTimePickerAndroid.open({
            value: date,
            onChange: (event: any, selectedDate: any) => {
                if (event.type === 'set') {
                    setTime(selectedDate);
                }
            },
            mode: 'time',
            is24Hour: false,
        });
    };

    const [isPublic, setIsPublic] = useState(false);
    const [selectedSport, setSelectedSport] = useState("");
    const [maxPlayers, setMaxPlayers] = useState(2);
    const [region, setRegion] = useState({
        latitude: Location.lat,
        longitude: Location.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });

    const playerRange = [...Array(19).keys()].map(i => i + 2);

    const mapActionSheetRef = useRef<ActionSheetRef>(null);
    const dateTimeActionSheetRef = useRef<ActionSheetRef>(null);
    const durationTimeActionSheetRef = useRef<ActionSheetRef>(null);

    const sportRef = useRef<ActionSheetRef>(null);
    const maxPlayersRef = useRef<ActionSheetRef>(null);

    const sportPickerRef = useRef<any>(null);
    const maxPlayersPickerRef = useRef<any>(null);

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
                        setLocationName(query);
                    }
                } else {
                    setQuery("");
                    setLocationName("");
                    setQueryPlaceholder("Search Location");
                }
            } catch (e) {

            }
        })();
    }, [region.latitude])

    var { data: sports, isLoading, error, refetch } = useSports();

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <ErrorBanner message='Error fetching sports' refetch={refetch} />;
    }

    const onChangeDateTimePicker = (event: any, selectedDateTime: any) => {
        if (selectedDateTime) {
            setDateTime(selectedDateTime);
        }
    };
    const onChangeDurationTimePicker = (event: any, selectedDurationTime: any) => {
        if (selectedDurationTime) {
            setDurationTime(selectedDurationTime);
        }
    };

    const handleMarkerDragEnd = async (e: any) => {
        const newCoordinate = e.nativeEvent.coordinate;
        setRegion({
            ...region,
            latitude: newCoordinate.latitude,
            longitude: newCoordinate.longitude,
        });
    };

    const combineDateAndTime = (dateValue: any, timeValue: any) => {
        const year = dateValue.getFullYear();
        const month = String(dateValue.getMonth() + 1).padStart(2, '0');
        const day = String(dateValue.getDate()).padStart(2, '0');
        const hours = String(timeValue.getHours()).padStart(2, '0');
        const minutes = String(timeValue.getMinutes()).padStart(2, '0');
        const seconds = String(timeValue.getSeconds()).padStart(2, '0');
        const combinedDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        return combinedDateTimeString;
    };

    const handleSubmit = async () => {
        if (!sessionName) {
            alert("Please enter a session name");
            return;
        }
        if (selectedSport == "Select a sport" || !selectedSport) {
            alert("Please select a sport");
            return;
        }

        var timeString = "";
        var endtimestring = "";
        var duration = extractDurationTime(durationTime);
        var minutes = duration['hours'] * 60 + duration['minutes'];
        if (Platform.OS == 'ios') {
            timeString = dateTime.toISOString();
            dateTime.setMinutes(dateTime.getMinutes() + minutes)
            endtimestring = new Date(dateTime).toISOString();
        } else {
            timeString = combineDateAndTime(date, time);
        }

        const data = {
            location_name: locationName,
            session_name: sessionName,
            lat: region.latitude,
            lng: region.longitude,
            username: user,
            start_time: timeString.substring(0, timeString.length - 1),
            end_time: endtimestring.substring(0, endtimestring.length - 1),
            sport: selectedSport,
            public: true,
            max_players: Number(maxPlayers)
        }

        try {
            const response = await axiosInstance.post('/session/create', data, {
                headers: {
                    'Content-Type': 'application/json', // Ensure the request is in JSON format
                }
            });
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            router.navigate("/")
            // You can navigate the user or display success feedback here
        } catch (error) {
            console.error('Error creating game:', error);
        }
    }


    const touchLocation = (index: number) => {
        getPlaceDetails(predictions[index].place_id);
        setQuery(predictions[index].description);
        setPredictions([]);
    }

    function onSportsPres() {
        if (Platform.OS == 'ios') {
            sportRef.current?.show();
        } else {
            sportPickerRef.current?.focus();
        }
    }

    function onMaxPlayersPress() {
        if (Platform.OS == 'ios') {
            maxPlayersRef.current?.show();
        } else {
            maxPlayersPickerRef.current?.focus();
        }
    }

    const formatDate = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = {
          weekday: 'short', // "Wed"
          month: 'short',   // "Nov"
          day: 'numeric',   // "6"
          hour: 'numeric',  // "1"
          minute: '2-digit', // "55"
          hour12: true,     // 12-hour format
        };
    
        return date.toLocaleString('en-US', options);
      };
    

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View className='flex-1 p-6 bg-[#EAEAEA]'>
                <GestureHandlerRootView>
                    <View className=''>
                        <Text className='text-lg mb-2 font-bold'>Session Name</Text>
                        <TextInput className='border-2 border-blue-900 p-3 mb-4 rounded-lg' value={sessionName} onChangeText={setSessionName} placeholderTextColor={"black"} placeholder='Enter session name...' />
                    </View>
                    
                    <View className='mb-6 flex-row py-2 justify-between'>
                        <Text className='text-lg font-bold py-1'>Sport</Text>
                        <TouchableOpacity
                            className="border-blue-900 border-2 px-4 py-1 rounded-lg justify-center items-center text-center"
                            onPress={onSportsPres}
                        >
                            <Text className='text-lg text-center'>{sports.filter((s: any) => s.key == selectedSport)[0]?.name || "Select a sport"}</Text>
                        </TouchableOpacity>

                    </View>

                    {Platform.OS == 'ios' ?
                        <ActionSheet ref={sportRef} containerStyle={{ height: 300, backgroundColor: 'white' }}>
                            <Picker
                                selectedValue={selectedSport}
                                onValueChange={(itemValue: any) =>
                                    setSelectedSport(itemValue)
                                }>
                                <Picker.Item label="Select a sport" value="" />
                                {sports?.map((sport: any) => (
                                    <Picker.Item key={sport.id} label={sport.name} value={sport.key} />
                                ))}
                            </Picker>
                        </ActionSheet>
                        :
                        <Picker
                            style={{ display: 'none' }}
                            ref={sportPickerRef}
                            selectedValue={selectedSport}
                            onValueChange={(itemValue: any) =>
                                setSelectedSport(itemValue)
                            }>
                            <Picker.Item label="Select a game" value="" />
                            {sports?.map((sport: any) => (
                                <Picker.Item key={sport.id} label={sport.name} value={sport.key} />
                            ))}
                        </Picker>

                    }

                    <View className=' overflow-auto'>
                        <Text className='text-lg mb-2 font-bold'>Location</Text>
                        <View className=' flex-row' >
                            <GoogleSearchPlaces setPredictions={setPredictions} query={query} setQuery={setQuery} placeholder={queryPlaceholder} refreshLocation={getCurrentLocation} />
                        </View>
                    </View>
                    {predictions.length > 0 &&
                        <View className=" flex-1 mx-2 rounded-lg z-50  bg-[#EAEAEA]" >
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
                    }

                    <View className=' mt-3 justify-center items-center'>
                        <Pressable className=' p-4 bg-blue-900 rounded-lg' onPress={() => mapActionSheetRef.current?.show()}>
                            <Text className=' text-white font-bold' >Pin on Map</Text>
                        </Pressable>
                    </View>

                    <ActionSheet
                        ref={mapActionSheetRef}
                        containerStyle={{
                            maxHeight: 600,
                            backgroundColor: 'transparent',
                        }}
                        indicatorStyle={{
                            width: 100,
                        }}>
                        <MapView
                            region={region}
                            onPress={handleMarkerDragEnd}
                            style={{ height: 400, marginHorizontal: 3, borderRadius: 20, backgroundColor: 'transparent' }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: region.latitude,
                                    longitude: region.longitude,
                                }}
                                draggable
                            />
                        </MapView>
                    </ActionSheet>

                    {Platform.OS == 'ios'
                        ?
                        <View>
                            <View className=' my-6 flex-row py-2 justify-between'>
                                <Text className='text-lg font-bold py-1'>Time</Text>
                                <Pressable className=' border-blue-900 border-2 px-4 py-1 rounded-lg justify-center items-center text-center' onPress={() => dateTimeActionSheetRef.current?.show()}>
                                    <Text className='text-lg text-center'>{formatDate(dateTime)}</Text>
                                </Pressable>
                            </View>
                            <ActionSheet
                                ref={dateTimeActionSheetRef}
                                enableGesturesInScrollView={true}
                                containerStyle={{
                                    height: 250,
                                    backgroundColor: 'white'
                                }}
                                indicatorStyle={{
                                    width: 100,
                                    maxHeight: 200
                                }}>
                                <RNDateTimePicker
                                    textColor='black'
                                    testID="dateTimePicker"
                                    value={dateTime}
                                    mode="datetime"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    minuteInterval={10}
                                    onChange={onChangeDateTimePicker}
                                />
                            </ActionSheet>
                            <View className=' mb-6 flex-row py-2 justify-between'>
                                <Text className='text-lg font-bold py-1'>Duration</Text>
                                <Pressable className=' border-blue-900 border-2 px-4 py-1 rounded-lg justify-center items-center text-center' onPress={() => durationTimeActionSheetRef.current?.show()}>
                                    <Text className='text-lg text-center'>{extractDurationTime(durationTime)['hours']} hrs {extractDurationTime(durationTime)['minutes']} mins</Text>
                                    {/* <Text className=' text-white font-bold' >Pick duration</Text> */}
                                </Pressable>
                            </View>
                            <ActionSheet
                                ref={durationTimeActionSheetRef}
                                enableGesturesInScrollView={true}
                                containerStyle={{
                                    height: 250,
                                    backgroundColor: 'white'
                                }}
                                indicatorStyle={{
                                    width: 100,
                                    maxHeight: 200
                                }}>
                                <RNDateTimePicker
                                    textColor='black'
                                    testID="dateTimePicker"
                                    value={durationTime}
                                    mode="countdown"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onChangeDurationTimePicker}
                                />
                            </ActionSheet>

                        </View>
                        :
                        <View className='my-2 flex-row justify-between'>
                            <View className='mb-6 w-1/2 p-2'>
                                <Text className='text-lg mb-2 font-bold'>Date</Text>
                                <View className='justify-center items-center'>
                                    <Text className='text-lg mb-2'>{date.toDateString()}</Text>
                                    <Pressable className=' p-4 bg-blue-900 rounded-lg' onPress={showDatePicker}>
                                        <Text className=' text-white font-bold' >Pick a date</Text>
                                    </Pressable>
                                </View>

                            </View>
                            <View className='mb-6 w-1/2 p-2'>
                                <Text className='text-lg mb-2 font-bold'>Time</Text>
                                <View className='justify-center items-center'>
                                    <Text className='text-lg mb-2'>{time.toLocaleTimeString()}</Text>
                                    <Pressable className=' p-4 bg-blue-900 rounded-lg' onPress={showTimePicker}>
                                        <Text className=' text-white font-bold' >Pick a time</Text>
                                    </Pressable>

                                </View>
                            </View>
                        </View>
                    }

                    <View className='mb-6 flex-row py-2 justify-between'>
                        <Text className='text-lg font-bold py-1'>Max Players</Text>

                        <TouchableOpacity
                            className="border-blue-900 border-2 px-4 py-1 rounded-lg justify-center items-center text-center"
                            onPress={onMaxPlayersPress}
                        >
                            <Text className='text-lg text-center'>{maxPlayers}</Text>
                        </TouchableOpacity>
                    </View>

                    {Platform.OS == 'ios' ?
                        <ActionSheet ref={maxPlayersRef} containerStyle={{ height: 300, backgroundColor: 'white' }}>
                            <Picker
                                selectedValue={maxPlayers}
                                onValueChange={(itemValue: any) =>
                                    setMaxPlayers(itemValue)
                                }>
                                {playerRange.map((num: any) => (
                                    <Picker.Item key={num} label={num} value={num} />
                                ))}
                            </Picker>
                        </ActionSheet>
                        :
                        <Picker
                            style={{ display: 'none' }}
                            ref={maxPlayersPickerRef}
                            selectedValue={maxPlayers}
                            onValueChange={(itemValue: any) =>
                                setMaxPlayers(itemValue)
                            }>
                            {playerRange.map((num: any) => (
                                <Picker.Item key={num} label={num} value={num} />
                            ))}
                        </Picker>

                    }

                    {/* <View className='flex-row justify-between items-center mb-6'>
                    <Text className='text-lg font-bold my-auto'>Public</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isPublic ? '#f5dd4b' : '#f4f3f4'}
                        onValueChange={setIsPublic}
                        value={isPublic}
                    />
                </View> */}

                    <View className='mb-6 justify-center items-center'>
                        <Pressable className=' p-4 bg-blue-900 rounded-lg w-min' onPress={handleSubmit}>
                            <Text className=' text-white font-bold w-min' >Submit</Text>
                        </Pressable>
                    </View>
                </GestureHandlerRootView>
            </View>
        </TouchableWithoutFeedback>
    )
}