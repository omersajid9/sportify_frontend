import { router } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Pressable, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
// import {ScrollView} from 'react-native-gesture-handler';
import * as AppleAuthentication from 'expo-apple-authentication';

import ActionSheet, { ActionSheetRef, SheetManager } from "react-native-actions-sheet";
import Apple from '../ExternalAuth/apple';

// import { decode } from 'base-64';
// import {decode}
import Ionicons from '@expo/vector-icons/Ionicons';
import { Feather, FontAwesome6 } from '@expo/vector-icons';

import PhoneInput from "react-native-phone-number-input";
import { useAuth } from '../app/context/auth';


export default function AuthWall() {



    return (
        <View
            className=" flex bg-blue-50 justify-center items-center p-10 rounded-lg">
            <Text className=' p-5 text-2xl font-semibold'>Join today to view.</Text>

            {/* <Pressable className=' p-5' onPress={() => SheetManager.show("authsheet")}>
                <Text className=' px-4 py-2 bg-blue-600 rounded-lg'>
                    Login
                </Text>
            </Pressable> */}
            <Pressable className='py-1 h-12 flex flex-row items-center justify-center gap-2' onPress={() => SheetManager.show("authsheet")}>
                <Text className=' text-blue-900 font-bold text-lg'>
                    Login
                </Text>
                <Feather name="log-in" size={30} color="rgb(30 58 138)" />
            </Pressable>



        </View>
    );
}
