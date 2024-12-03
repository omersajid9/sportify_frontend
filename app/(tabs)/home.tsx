import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import GoingPage from '../../components/GoingPage';
import PlusButton from '../../components/PlusButton';
import PastPage from '../../components/PastDays';
import { AnimatePresence, MotiView } from 'moti';
import { useAuth } from '../context/auth';
import AuthWall from '../../components/AuthWall';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'
import { Tab } from 'react-native-elements';
import { HomeHeader } from '../../components/Header';

export default function Home() {
    const { user } = useAuth();
    const [tab, setTab] = useState('Upcoming');


    return (
        <View className='flex-1'>
            {/* <Stack.Screen
                options={{
                    headerShown: true,
                    header: () => <HomeHeader />
                }}
            /> */}
            {/* Tab Buttons */}
            <View className='flex flex-row gap-4 p-4 px-8'>
                <TabButton text="Upcoming" tab={tab} setTab={setTab} />
                <TabButton text="Past" tab={tab} setTab={setTab} />
            </View>

            {user ?
                <View className=' flex-1 h-full'>
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



function TabButton({ text, tab, setTab }: { text: String, tab: String, setTab: (text: string) => void }) {
    return (
        <TouchableOpacity onPress={() => setTab(text.toString())} >
            {/* <MotiView
                style={{
                    backgroundColor: text === tab ? '#222222' : '#e0e0e0', // Light gray
                }}
                animate={{
                    scale: text === tab ? 1.2 : 1,
                    opacity: text === tab ? 1 : 0.6,
                }}
                transition={{
                    type: 'spring',
                    damping: 15,
                    stiffness: 150,
                }}
                className="flex items-center justify-center  px-3 rounded-lg py-2 shadow-sm w-28"
            > */}
                <Text className={` ${text === tab ? ' text-[#F2F2F2]' : ' text-[#222222'}`}>{text}</Text>
            {/* </MotiView> */}
        </TouchableOpacity>
    )
}



{/* <MotiView
key="upcoming"
from={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
>
<GoingPage />
</MotiView>
) : (
<MotiView
key="past"
from={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
>
<PastPage />
</MotiView> */}
