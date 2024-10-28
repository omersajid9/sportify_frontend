
import MapView, { Marker, Region } from 'react-native-maps';
import React from 'react';

interface GameMapProps {
    games: any;
    region: any;
    setRegion: any;
}

export default function GameMap({games, region, setRegion}: GameMapProps) {

    const onRegionChangeComplete = (newRegion: Region) => {
        setRegion(newRegion);
    };


    const getMarkerColor = (gameType: string) => {
        switch (gameType) {
            case 'Table Tennis':
                return 'orange';
            case 'Tennis':
                return 'green';
            case 'Pickle Ball':
                return 'blue';
            default:
                return 'red';
        }
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
                        longitude: game.lon,
                    }}
                    pinColor={getMarkerColor(game.sport)}
                    title={game.name}
                    description={game.description}
                />
            ))}
        </MapView>
    )


}