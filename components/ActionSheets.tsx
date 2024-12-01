import { View, Text, Keyboard, TextInput, TouchableOpacity, Pressable } from "react-native";
import ActionSheet, { SheetManager, SheetProps, registerSheet } from "react-native-actions-sheet";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import PhoneInput from "react-native-phone-number-input";
import Apple from "../ExternalAuth/apple";
import React, { useRef, useState } from 'react';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons'
import { useAuth } from "../app/context/auth";



function AuthSheet() {
    const { sendOptSMS, logIn } = useAuth();

    const [authType, setAuthType] = useState("Phone");

    const [opt, setOpt] = useState("");
    const [email, setEmail] = useState("omer");
    const [password, setPassword] = useState("a");


    const [optSend, setOptSend] = useState(false);
    const [phone, setPhone] = useState('');
    const [formattedValue, setFormattedValue] = useState('');
    const [valid, setValid] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);


    function checkValid(phone: string) {
        phoneInput.current?.forceUpdate()
        const checkValid = phoneInput.current?.isValidNumber(phone);
        setValid(checkValid ? checkValid : false);
        let getNumberAfterPossiblyEliminatingZero = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
    }

    function handleSendOptSMS() {
        if (valid) {
            sendOptSMS(formattedValue);
            setOptSend(true);
            Keyboard.dismiss();
            console.log("valid")
        } else {
            console.log("not valid")
        }
    }

    async function handleLogin() {
        const auth_type = authType;
        console.log(auth_type)
        if (auth_type == 'Phone') {
            const auth_id = formattedValue;
            const passcode = opt;
            logIn(auth_type, auth_id, passcode);
            await SheetManager.hide("authsheet");
        } else if (auth_type == 'Email') {
            const auth_id = email;
            const passcode = password
            logIn(auth_type, auth_id, passcode);
            await SheetManager.hide("authsheet");
        } else if (auth_type == 'Apple') {
            // logIn(auth_type, auth_id, passcode);
        }
    }

    return (
        <ActionSheet
            gestureEnabled={true}
            keyboardHandlerEnabled={false}
            isModal={true}
        >
            <View className=' h-4/6'>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <Text className='text-center py-5 font-semibold'>
                        Log In With A Single Tap
                    </Text>


                    <View className='flex flex-col gap-6 justify-center mx-auto my-5 w-2/3 '>
                        {authType == 'Phone' ?
                            <>
                                <PhoneInput
                                    containerStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 'auto', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}
                                    textContainerStyle={{ borderColor: phone.length > 1 ? (valid ? 'green' : 'red') : 'white', borderWidth: 2, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}
                                    flagButtonStyle={{ justifyContent: 'center', alignItems: 'center', height: 40, width: 50, margin: 10 }}
                                    ref={phoneInput}
                                    defaultValue={phone}
                                    value={phone}
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
                                {optSend &&
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
                                }
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
                                    className="w-full py-3 border-2 border-[#222222] rounded-lg px-4 "
                                />
                                <TextInput
                                    value={password}
                                    onChangeText={(password) => setPassword(password)}
                                    placeholderTextColor={'grey'}
                                    placeholder="Password"
                                    autoCapitalize="none"
                                    nativeID="password"
                                    style={{ textAlignVertical: 'center', textAlign: 'justify', fontSize: 18 }}
                                    className="w-full py-3 border-2 border-[#222222] rounded-lg px-4 "
                                />
                            </>
                        }
                    </View>
                </TouchableWithoutFeedback>


                {!optSend && authType == 'Phone' ?
                    <View className='flex justify-evenly items-center px-10 my-5'>
                        <TouchableOpacity onPress={handleSendOptSMS} className=' bg-blue-700 rounded-lg w-[200px] h-[44px] items-center justify-center'>
                            <Text className='text-center text-xl text-white font-semibold'>Verify Number</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View className='flex justify-evenly items-center px-10 my-5'>
                        <TouchableOpacity onPress={handleLogin} className=' bg-blue-700 rounded-lg w-[200px] h-[44px] items-center justify-center'>
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
        </ActionSheet>

    )
}

registerSheet('authsheet', AuthSheet);
