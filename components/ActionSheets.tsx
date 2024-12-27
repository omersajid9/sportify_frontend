import { View, Text, Keyboard, TextInput, TouchableOpacity, Pressable } from "react-native";
import ActionSheet, { ActionSheetProps, ActionSheetRef, SheetManager, SheetProps, registerSheet } from "react-native-actions-sheet";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import PhoneInput from "react-native-phone-number-input";
import Apple from "../ExternalAuth/apple";
import React, { useEffect, useRef, useState } from 'react';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons'
import { useAuth } from "../app/context/auth";



function AuthSheet() {
    const { sendOptSMS, logIn } = useAuth();

    const [authType, setAuthType] = useState("Phone");

    const [opt, setOpt] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const [optSend, setOptSend] = useState(false);
    const [phone, setPhone] = useState('');
    const [formattedValue, setFormattedValue] = useState('');
    const [valid, setValid] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);

    const actionsheetRef = useRef<ActionSheetRef>(null);
    const [initial, setInitial] = useState(false);

    function checkValid(phone: string) {
        phoneInput.current?.forceUpdate()
        const checkValid = phoneInput.current?.isValidNumber(phone);
        setValid(checkValid ? checkValid : false);
        let getNumberAfterPossiblyEliminatingZero = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
    }

    useEffect(() => {
        if (optSend || authType == 'Username') {
            actionsheetRef.current?.snapToOffset(120)
            setInitial(true)
        }
         else {
            if (initial) {
                actionsheetRef.current?.snapToOffset(100)
            }
        }
    }, [optSend, authType])

    function handleSendOptSMS() {
        if (valid) {
            sendOptSMS(formattedValue);
            setOptSend(true);
            Keyboard.dismiss();
        } else {
        }
    }

    async function handleLogin() {
        const auth_type = authType;
        if (auth_type == 'Phone') {
            const auth_id = formattedValue;
            const passcode = opt;
            logIn(auth_type, auth_id, passcode);
            await SheetManager.hide("authsheet");
        } else if (auth_type == 'Username') {
            const auth_id = username;
            const passcode = password
            logIn(auth_type, auth_id, passcode);
            await SheetManager.hide("authsheet");
        } else if (auth_type == 'Apple') {
            // logIn(auth_type, auth_id, passcode);
        }
    }

    return (
        <ActionSheet
            ref={actionsheetRef}
            gestureEnabled={true}
            keyboardHandlerEnabled={false}
            isModal={true}
            containerStyle={{height: 500}}
        >
            <View className=''>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <Text className='text-center py-5 font-semibold'>
                        Log In With A Single Tap
                    </Text>


                    <View className='flex flex-col gap-6 justify-center mx-auto my-5 w-2/3 '>
                        {authType == 'Phone' ?
                            <>
                                <View>
                                    <Text className='text-lg px-2 font-semibold'>Mobile Number</Text>
                                    <PhoneInput
                                        containerStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 'auto', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10, borderColor: phone.length > 1 ? (valid ? 'green' : 'red') : '#222222', borderWidth: 2,  }}
                                        textContainerStyle={{ borderTopRightRadius: 10, borderBottomRightRadius: 10 }}
                                        textInputStyle={{fontSize: 18}}
                                        flagButtonStyle={{ justifyContent: 'center', alignItems: 'center', height: 40, width: 50, margin: 10 }}
                                        ref={phoneInput}
                                        defaultValue={phone}
                                        value={phone}
                                        placeholder="123-456-7890"
                                        defaultCode="US"
                                        layout="first"
                                        onChangeText={(text) => {
                                            setOptSend(false);
                                            setPhone(text);
                                            checkValid(text);
                                        }}
                                        onChangeFormattedText={(text) => {
                                            setFormattedValue(text);
                                            checkValid(text);
                                        }}
                                        withShadow
                                    />
                                </View>
                                {optSend &&
                                    <View>
                                    <Text className='text-lg px-2 font-semibold'>OTP Code</Text>
                                        <TextInput
                                            value={opt}
                                            onChangeText={(opt) => setOpt(opt)}
                                            placeholderTextColor={'grey'}
                                            placeholder="OTP Code"
                                            autoCapitalize="none"
                                            nativeID="otp"
                                            style={{ textAlignVertical: 'center', textAlign: 'center', fontSize: 18 }}
                                            className="w-full py-3 border-2 border-[#222222] rounded-lg px-4"
                                            keyboardType='number-pad'
                                        />
                                    </View>
                                }
                            </>
                            :
                            <>
                                <View>
                                    <Text className='text-lg px-2 font-semibold'>Username</Text>
                                    <TextInput
                                        value={username}
                                        onChangeText={(username) => setUsername(username)}
                                        placeholderTextColor={'grey'}
                                        placeholder="e.g. johndoe"
                                        autoCapitalize="none"
                                        nativeID="username"
                                        style={{ textAlignVertical: 'center', textAlign: 'justify', fontSize: 18 }}
                                        className="w-full py-2 border-2 border-[#222222] rounded-lg px-4 "
                                    />
                                </View>
                                <View>
                                    <Text className='text-lg px-2 font-semibold'>Password</Text>
                                    <TextInput
                                        value={password}
                                        onChangeText={(password) => setPassword(password)}
                                        placeholderTextColor={'grey'}
                                        placeholder="********"
                                        autoCapitalize="none"
                                        nativeID="password"
                                        style={{ textAlignVertical: 'center', textAlign: 'justify', fontSize: 18 }}
                                        className="w-full py-2 border-2 border-[#222222] rounded-lg px-4 "
                                    />
                                </View>
                            </>
                        }
                    </View>
                </TouchableWithoutFeedback>


                {!optSend && authType == 'Phone' ?
                    <View className='flex justify-evenly items-center px-10 my-5'>
                        <TouchableOpacity onPress={handleSendOptSMS} className=' bg-[#222222] rounded-lg w-[200px] h-[44px] items-center justify-center'>
                            <Text className='text-center text-xl text-white font-semibold'>Verify Number</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View className='flex justify-evenly items-center px-10 my-5'>
                        <TouchableOpacity onPress={handleLogin} className=' bg-[#222222] rounded-lg w-[200px] h-[44px] items-center justify-center'>
                            <Text className='text-center text-xl text-white font-semibold'>Join</Text>
                        </TouchableOpacity>
                    </View>
                }


                <Text className='text-center my-5 text-base'>Or</Text>

                <View className='my-5 flex flex-row items-center justify-center gap-20'>
                    <Apple />
                    <View className='flex items-center'>
                        {authType == 'Phone' ?
                            <Pressable
                                onPress={() => setAuthType("Username")}
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
        </ActionSheet>

    )
}

registerSheet('authsheet', AuthSheet);
