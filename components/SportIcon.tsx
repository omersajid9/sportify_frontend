import React from "react";
import {FontAwesome5, MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';

interface SportIconProps {
    sport_icon: string;
    sport_icon_source: string;
    color: string;
    size: number;
}


export default function SportIcon({sport_icon, sport_icon_source, color, size}: SportIconProps) {
    if (sport_icon_source == 'fontawesome5') {
        return (
            <FontAwesome5
            name={sport_icon}
            size={size}
            className=""
            color={color}
          />
        )
    } else if (sport_icon_source == 'materialicons' && sport_icon == 'sports-tennis') {
        return (
            <MaterialIcons
            name={sport_icon}
            size={size}
            className=""
            color={color}
          />
        )
    } else if (sport_icon_source == 'materialcommunityicons' && sport_icon == 'racquetball') {
        return (
            <MaterialCommunityIcons
            name={sport_icon}
            size={size}
            className=""
            color={color}
          />
        )
    }
}