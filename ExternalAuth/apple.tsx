import * as AppleAuthentication from 'expo-apple-authentication';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import React from 'react';
import { jwtDecode } from 'jwt-decode';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

async function appleSignIn() {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (credential.identityToken) {
      const decoded = jwtDecode(credential.identityToken);
      console.log('decoded token: ', decoded);
    }
    console.log(credential)
  } catch (e: any) {
    if (e.code === 'ERR_REQUEST_CANCELED') {
      // handle that the user canceled the sign-in flow
    } else {
      // handle other errors
    }
  }
}

export default function Apple() {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
