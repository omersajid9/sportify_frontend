import { View, Text, TouchableOpacity } from 'react-native';
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
import { getUserProfile } from '../../components/ProfilePage';

export default function Home() {
    const { user } = useAuth();
    const [tab, setTab] = useState('Upcoming');


    return (
        <View className='flex-1'>
            <Stack.Screen
                options={{
                    headerShown: true,
                    header: () => <Header />
                }}
            />
            {/* Tab Buttons */}
            <View className='flex flex-row gap-2 p-4'>
                <TabButton text="Upcoming" tab={tab} setTab={setTab} />
                <TabButton text="Past" tab={tab} setTab={setTab} />
            </View>

            {user ?
                <View className=' flex-1 h-full'>
                    <View className=' flex-1 h-full'>
                        <AnimatePresence>
                            {tab == 'Upcoming' ? (
                                <MotiView
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
                                </MotiView>
                            )}
                        </AnimatePresence>
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
        <TouchableOpacity onPress={() => setTab(text.toString())} className={` px-4 py-3 border-2 rounded-lg ${text == tab ? 'bg-blue-100 border-blue-900' : 'bg-neutral-100 border-neutral-200'}`}>
            <Text>{text}</Text>
        </TouchableOpacity>
    )
}



const Header = () => {
    const { user } = useAuth();

    // const { data: data, isLoading: gamesLoading, error: gamesError, refetch } = getUserProfile(user);
    // console.log(data)


    return (
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-300">
            <View className="flex-row items-center justify-center">
                {/* <Text className='text-center '>Home</Text> */}
            </View>

            {user ?
            <View className="flex-row items-center">
                <TouchableOpacity className="ml-4" onPress={() => router.push("/notifications")}>

                    <Ionicons name="notifications" size={24} color="rgb(30 58 138)" />
                </TouchableOpacity>
            </View>
            :
            <View className="flex-row items-center">
                <TouchableOpacity className="ml-4" onPress={() => router.push("/notifications")}>

                    <Ionicons name="notifications" size={24} color="rgb(30 58 138)" />
                </TouchableOpacity>
            </View>
            }

        </View>
    );
};