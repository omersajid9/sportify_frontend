
import MapView, { Marker, Region } from 'react-native-maps';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import GameView from './GameView';
import { FlashList } from '@shopify/flash-list';
import { Octicons } from '@expo/vector-icons';

interface GameMapProps {
    games: any;
    region: any;
    setRegion: any;
}

export default function GameMap({ games, region, setRegion }: GameMapProps) {

    const onRegionChangeComplete = (newRegion: Region) => {
        setRegion(newRegion);
    };

    const [index, setIndex] = useState(0);
    const [seeCards, setSeeCards] = useState(true);

    useEffect(() => {
        if (games?.length > 0 && index < games.length) {
            setRegion({
                ...region,
                latitude: games[index].lat,
                longitude: games[index].lon,
            })
        }

    }, [index]);



    const markerColors = [
        '#A29BFE', // Light Lavender
        '#6C5CE7', // Matte Purple
        '#81ECEC', // Soft Cyan
        '#00B894', // Matte Green
        '#FFEAA7', // Soft Yellow
        '#FAB1A0', // Matte Coral
        '#FD79A8', // Soft Pink
        '#55EFC4', // Aqua Green
        '#FDCB6E', // Matte Orange
        '#E17055', // Soft Peach
        '#D63031', // Deep Red
        '#0984E3', // Matte Blue
        '#74B9FF', // Sky Blue
        '#636E72', // Cool Gray
        '#B2BEC3', // Light Gray
        '#2D3436', // Charcoal
        '#E84393', // Matte Rose
        '#00CEC9', // Cool Teal
        '#B8E994', // Soft Green
        '#2C3A47'  // Dark Matte Navy
    ];

    const sports = [
        'Soccer',
        'Basketball',
        'Football',
        'Volleyball',
        'Cricket',
        'Baseball',
        'Running',
        'Cycling',
        'Weightlifting',
        'Swimming',
        'Skateboarding',
        'Yoga',
        'Bowling',
        'Table Tennis',
        'Tennis',
        'Pickle Ball'
    ];


    const getMarkerColor = (gameType: string) => {
        return markerColors[sports.indexOf(gameType)];
    };

    return (
        <View className='flex-1'>
            <MapView
                style={{ flex: 1, borderRadius: 10 }}
                region={region}
                onRegionChangeComplete={onRegionChangeComplete}

            >
                {games?.map((game: any, ind: any) => (
                    <Marker
                        key={game.id}
                        coordinate={{
                            latitude: game.lat,
                            longitude: game.lon
                        }}
                        pinColor={getMarkerColor(game.sport)}
                        title={game.name}
                        description={game.description}
                        onPress={() => {setSeeCards(true);setIndex(ind)}}
                    />
                ))}
            </MapView>
            {games?.length > 0 &&
                <View className='flex-1  absolute bottom-1 w-full '>
                    <Pressable
                        className="px-4 py-2 rounded-2xl bg-[#EAEAEA] w-fit ml-auto mr-4 justify-end"
                        onPress={() => setSeeCards(!seeCards)}
                    >
                        <Text className=' text-lg font-semibold'>{!seeCards? "See Cards": "Hide Cards"}</Text>
                        {/* <MaterialCommunityIcons name="reload" size={24} color="rgb(34 34 34)" /> */}
                    </Pressable>

                    {seeCards &&
                        <Carousel games={games} index={index} setIndex={setIndex} />
                    }

                </View>
            }
        </View>
    )


}

import { useRef } from 'react';
import { Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

const Carousel = ({ games, index, setIndex }: { games: any[], index: number, setIndex: (index: number) => void }) => {
    const screenWidth = Dimensions.get('window').width;
    const carouselRef = useRef<FlashList<any>>(null);

    const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const itemWidth = screenWidth; // 80% of screen width
        const index = Math.round(offsetX / itemWidth);

        setIndex(index);
        // Scroll to the snapped index
        // carouselRef.current?.scrollToIndex({ index, animated: true });
    };

    useEffect(() => {
        carouselRef.current?.scrollToIndex({ index, animated: true });
    }, [index]);

    return (
        <View className="flex-1 w-full ">

            <FlashList
                ref={carouselRef}
                className='flex-1'
                horizontal
                data={games}
                renderItem={(item: any) =>
                    <View className='flex-1 w-screen p-2 ' >
                        <GameView key={item.id} gameData={item} explore={false} />
                    </View>
                }
                snapToStart={true}
                estimatedItemSize={200}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                snapToAlignment="start"
                onMomentumScrollEnd={onScrollEnd} // Trigger snapping
                decelerationRate="fast" // Makes snapping faster
                snapToInterval={screenWidth} // Snap based on item width
            />
        </View>
    );
};
