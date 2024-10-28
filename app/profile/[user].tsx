import React from 'react';
import ProfilePage from '../../components/ProfilePage';
import { useLocalSearchParams } from 'expo-router';


export default function Profile () {
    var { user } = useLocalSearchParams();
    user = Array.isArray(user) ? user[0] : user;  
    
    return (
        <ProfilePage user={user} visit={true}/>
    )
}