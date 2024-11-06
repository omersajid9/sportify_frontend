import React from "react";
import {FontAwesome5, MaterialIcons, MaterialCommunityIcons, FontAwesome6, FontAwesome, Ionicons} from '@expo/vector-icons';

interface SportIconProps {
    sport_icon: any;
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
    } else if (sport_icon_source == 'materialicons') {
        return (
            <MaterialIcons
            name={sport_icon}
            size={size}
            className=""
            color={color}
          />
        )
    } else if (sport_icon_source == 'materialcommunityicons') {
        return (
            <MaterialCommunityIcons
            name={sport_icon}
            size={size}
            className=""
            color={color}
          />
        )
    } else if (sport_icon_source == 'fontawesome6') {
        return (
            <FontAwesome6
            name={sport_icon}
            size={size}
            className=""
            color={color}
          />
        )
    } else if (sport_icon_source == 'fontawesome') {
        return (
            <FontAwesome
            name={sport_icon}
            size={size}
            className=""
            color={color}
          />
        )
    } else if (sport_icon_source == 'ionicons') {
        return (
            <Ionicons
            name={sport_icon}
            size={size}
            className=""
            color={color}
          />
        )
    }
}