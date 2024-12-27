import { View, Text, Pressable, Linking } from 'react-native';
import React, { useMemo, useState } from 'react';
import SignIn from './(auth)/sign-in';
import SignUp from './(auth)/sign-up';
import Apple from '../ExternalAuth/apple';


export default function AuthPage() {
    const [signinpage, setSigninpage] = useState(false);

    return (
        <View className='flex py-10'>
            <View className='flex'>
                <View className='flex flex-row justify-evenly px-10'>
                    <Pressable
                        className={`flex-1 ${!signinpage ? 'bg-[#222222] border-blue-500' : 'bg-gray-200 border-gray-300'}`}
                        onPress={() => setSigninpage(false)}
                    >
                        <Text
                            className={`w-full text-center p-4 rounded-lg ${!signinpage ? 'text-white' : 'text-gray-500'}`}
                        >
                            Sign-in
                        </Text>
                    </Pressable>

                    <Pressable
                        className={`flex-1 ${signinpage ? 'bg-[#222222] border-blue-500' : 'bg-gray-200 border-gray-300'}`}
                        onPress={() => setSigninpage(true)}
                    >
                        <Text
                            className={`w-full text-center p-4 rounded-lg ${signinpage ? 'text-white' : 'text-gray-500'}`}
                        >
                            Sign-up
                        </Text>
                    </Pressable>
                </View>

            </View>
        </View>
    );
}