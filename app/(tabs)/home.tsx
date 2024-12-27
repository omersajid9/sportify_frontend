import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import React, { useState } from 'react';
import GoingPage from '../../components/GoingPage';
import PastPage from '../../components/PastDays';
import { useAuth } from '../context/auth';
import AuthWall from '../../components/AuthWall';
import { ScaleTouchable } from '../../components/SportDateSelector';
import { Stack } from 'expo-router';

export default function Home() {
    const { user } = useAuth();
    const [tab, setTab] = useState('Upcoming');


    return (
        <View className='flex-1'>
            {user ?
                <View className=' flex-1 h-full'>
                    <View className='flex flex-row gap-4 p-4 px-8'>
                        <TabButton text="Upcoming" tab={tab} setTab={setTab} />
                        <TabButton text="Past" tab={tab} setTab={setTab} />
                    </View>

                    <View className=' flex-1 h-full'>
                        {tab == 'Upcoming' ? (
                            <GoingPage />
                        ) : (
                            <PastPage />
                        )}
                    </View>
                </View>
                :
                <AuthWall />
            }

        </View>
    )
}



function TabButton({ text, tab, setTab }: { text: String, tab: string, setTab: (text: string) => void }) {
    return (
        <ScaleTouchable
            className={`px-4 py-2 rounded-lg ${tab == text ? 'bg-[#222222] ' : 'bg-[#e0e0e0] '
                }`}
            onPress={() => setTab(text.toString())}
            selectedVal={text}
            val={tab}
        >
            <Text className={` ${text === tab ? ' text-[#F2F2F2]' : ' text-[#222222'}`}>{text}</Text>
        </ScaleTouchable>
    )
}