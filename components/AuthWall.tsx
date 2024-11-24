import { router } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Pressable, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
// import {ScrollView} from 'react-native-gesture-handler';
import * as AppleAuthentication from 'expo-apple-authentication';

import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import Apple from '../ExternalAuth/apple';

// import { decode } from 'base-64';
// import {decode}
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome6 } from '@expo/vector-icons';

import PhoneInput from "react-native-phone-number-input";



export default function AuthWall() {
    const authSheetRef = useRef<ActionSheetRef>(null);

    const [authType, setAuthType] = useState("Phone");

    // const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const [phone, setPhone] = useState('');
    const [formattedValue, setFormattedValue] = useState('');
    const [valid, setValid] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);


    function checkValid(phone: string) {
        phoneInput.current?.forceUpdate()
        const checkValid = phoneInput.current?.isValidNumber(phone);
        setValid(checkValid ? checkValid : false);
        let getNumberAfterPossiblyEliminatingZero = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
        console.log(getNumberAfterPossiblyEliminatingZero);
    }

    return (
        <View
            className=" flex bg-blue-50 justify-center items-center p-10 rounded-lg">
            <Text className=' p-5 text-2xl font-semibold'>Join today to view.</Text>

            <Pressable className=' p-5' onPress={() => authSheetRef.current?.show()}>
                <Text className=' px-4 py-2 bg-blue-600 rounded-lg'>
                    Login
                </Text>
            </Pressable>


            <ActionSheet
                gestureEnabled={true}
                keyboardHandlerEnabled={false} ref={authSheetRef}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View className=' h-4/6'>
                        <Text className='text-center py-5 font-semibold'>
                            Log In With A Single Tap
                        </Text>


                        <View className='flex flex-col gap-6 justify-center mx-auto my-5 w-2/3 '>
                            {authType == 'Phone' ?
                                <>
                                    <PhoneInput
                                        containerStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 'auto', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}
                                        textContainerStyle={{ borderColor: 'white', borderWidth: 0, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}
                                        flagButtonStyle={{ justifyContent: 'center', alignItems: 'center', height: 40, width: 50, margin: 10 }}                                    
                                        ref={phoneInput}
                                        defaultValue={phone}
                                        value={phone}
                                        defaultCode="US"
                                        layout="first"
                                        onChangeText={(text) => {
                                            console.log(text)
                                            setPhone(text);
                                            checkValid(text);
                                        }}
                                        onChangeFormattedText={(text) => {
                                            setFormattedValue(text);
                                            checkValid(text);
                                        }}
                                        // countryPickerProps={{ withAlphaFilter: true }}
                                        withShadow
                                    />
                                </>
                                :
                                <>
                                    <TextInput
                                        value={email}
                                        onChangeText={(email) => setEmail(email)}
                                        placeholderTextColor={'grey'}
                                        placeholder="Email Address"
                                        autoCapitalize="none"
                                        nativeID="email"
                                        style={{ textAlignVertical: 'center', textAlign: 'justify', fontSize: 18 }}
                                        className="w-full py-3 border-2 border-blue-900 rounded-lg px-4 "
                                    />
                                    <TextInput
                                        value={password}
                                        onChangeText={(password) => setPassword(password)}
                                        placeholderTextColor={'grey'}
                                        placeholder="Password"
                                        autoCapitalize="none"
                                        nativeID="password"
                                        style={{ textAlignVertical: 'center', textAlign: 'justify', fontSize: 18 }}
                                        className="w-full py-3 border-2 border-blue-900 rounded-lg px-4 "
                                    />
                                </>
                            }
                        </View>

                        <View className='flex justify-evenly items-center px-10 my-5'>
                            <TouchableOpacity className=' bg-blue-700 rounded-lg w-[200px] h-[44px] items-center justify-center'>
                                <Text className='text-center text-xl text-white font-semibold'>Join</Text>
                            </TouchableOpacity>
                        </View>


                        <Text className='text-center my-5 text-base'>Or</Text>

                        <View className='my-5 flex flex-row items-center justify-center gap-20'>
                            <Apple />
                            <View className='flex items-center'>
                                {authType == 'Phone' ?
                                    <Pressable
                                        onPress={() => setAuthType("Email")}
                                        className='flex justify-center items-center px-3 py-3 rounded-lg aspect-square bg-black'>
                                        <Ionicons name="mail" size={40} color="white" />
                                    </Pressable>
                                    :
                                    <Pressable
                                        onPress={() => setAuthType("Phone")}
                                        className='flex justify-center items-center px-3 py-3 rounded-lg aspect-square bg-black'>
                                        <FontAwesome6 name="phone" size={39} color="white" />
                                    </Pressable>
                                }
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ActionSheet>
        </View>
    );
}
