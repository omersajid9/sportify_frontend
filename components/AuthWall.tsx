import { router } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, ScrollView, Pressable, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
// import {ScrollView} from 'react-native-gesture-handler';
import * as AppleAuthentication from 'expo-apple-authentication';

import ActionSheet, { ActionSheetRef, SheetManager } from "react-native-actions-sheet";
import Apple from '../ExternalAuth/apple';

// import { decode } from 'base-64';
// import {decode}
import Ionicons from '@expo/vector-icons/Ionicons';
import { Feather, FontAwesome6, Octicons } from '@expo/vector-icons';

import PhoneInput from "react-native-phone-number-input";
import { useAuth } from '../app/context/auth';
import { SvgUri } from 'react-native-svg';


export default function AuthWall() {


    const { uri } = Image.resolveAssetSource(require('../assets/login.svg'))

    return (
        <View
            className=" flex bg-transparent justify-center items-center p-10 rounded-lg">
            <Text className=' p-5 text-2xl font-semibold'>Join today to view.</Text>

            {/* <Pressable className=' p-5' onPress={() => SheetManager.show("authsheet")}>
                <Text className=' px-4 py-2 bg-blue-600 rounded-lg'>
                    Login
                </Text>
            </Pressable> */}
            <SvgUri
                width="200px"
                height="200px"
                color={'green'}
                fill={'green'}
                stroke={'#1e3a8a'}
                // style={{ width: 256, height: 256, marginBottom: 32 }}
                uri={uri}
            />

            <Pressable className='py-1 px-4 h-12 flex flex-row items-center justify-center gap-2 bg-[#f2f2f2] rounded-lg w-min' onPress={() => SheetManager.show("authsheet")}>
                <Text className=' text-[#222222] font-bold text-lg'>
                    Login
                </Text>
                <Octicons name="sign-in" size={30} color="#222222" />
            </Pressable>



        </View>
    );
}
