import * as AppleAuthentication from 'expo-apple-authentication';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import React from 'react';
import { jwtDecode } from 'jwt-decode';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useAuth } from '../app/context/auth';


export default function Apple() {
  const {logIn} = useAuth();

  async function appleSignIn() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
  
      if (credential.email) {
        logIn('apple', credential.email, undefined, credential.fullName?.givenName ?? undefined, credential.fullName?.familyName ?? undefined)
      } else if (credential.identityToken) {
        const decoded: any = jwtDecode(credential.identityToken);
        logIn('apple', decoded.email, undefined, undefined, undefined)
      }
      
    } catch (e: any) {
      if (e.code === 'ERR_REQUEST_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  }
  
  return (
    <View className='flex items-center'>
      <Pressable
        className='flex justify-center items-center px-4 py-3 rounded-lg aspect-square bg-black'
        onPress={appleSignIn}>
        <FontAwesome6 name="apple" size={40} color="white" />
      </Pressable>
    </View>
  );
}