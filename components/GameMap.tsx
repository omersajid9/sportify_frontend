
import MapView, { Marker, Region } from 'react-native-maps';
import React from 'react';
import { router } from 'expo-router';

interface GameMapProps {
    games: any;
    region: any;
    setRegion: any;
}

export default function GameMap({ games, region, setRegion }: GameMapProps) {

    const onRegionChangeComplete = (newRegion: Region) => {
        setRegion(newRegion);
    };

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

        <MapView
            style={{ flex: 1, borderRadius: 10 }}
            region={region}
            onRegionChangeComplete={onRegionChangeComplete}
        >
            {games?.map((game: any) => (
                <Marker
                    key={game.id}
                    coordinate={{
                        latitude: game.lat,
                        longitude: game.lon
                    }}
                    pinColor={getMarkerColor(game.sport)}
                    title={game.name}
                    description={game.description}
                    onPress={() => router.push("/joinSession/" + game.id)}
                />
            ))}
        </MapView>
    )


}