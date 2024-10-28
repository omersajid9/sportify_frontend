import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import ProfilePage from '../../components/ProfilePage';
import { useAuth } from '../context/auth';


export default function Profile () {
    const {user} = useAuth();

    return (
        <ProfilePage user={user} visit={false}/>
    )
}