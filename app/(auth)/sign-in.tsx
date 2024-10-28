import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useAuth } from "../context/auth";
import { Stack, useRouter } from "expo-router";
import { useRef } from "react";
import React from "react";

export default function SignIn() {
  const { signIn } = useAuth();
  const router = useRouter();

  const usernameRef = useRef("");
  const passwordRef = useRef("");
  return (
    <>
      <Stack.Screen options={{ title: "Sign In", headerShown: true }} />
      <View className="flex-1 justify-center items-center">
        <View className="mb-4 w-3/4">
          <Text className="text-lg mb-2 text-blue-900">Username</Text>
          <TextInput
            placeholderTextColor={'grey'}
            placeholder="username"
            autoCapitalize="none"
            nativeID="username"
            onChangeText={(text) => {
              usernameRef.current = text;
            }}
            className="border border-blue-900 rounded px-2 py-1 mb-4"
          />
        </View>
        <View className="mb-4 w-3/4">
          <Text className="text-lg mb-2 text-blue-900">Password</Text>
          <TextInput
            placeholderTextColor={'grey'}
            placeholder="password"
            secureTextEntry={true}
            nativeID="password"
            onChangeText={(text) => {
              passwordRef.current = text;
            }}
            className="border border-blue-900 rounded px-2 py-1 mb-4"
          />
        </View>
        <View className=' mt-3 justify-center items-center'>
          <Pressable className=' p-4 bg-blue-900 rounded-lg' onPress={async () => {
            const { data, error } = await signIn(
              usernameRef.current,
              passwordRef.current
            );
            if (data) {
              router.replace("/");
            } else {
              console.log(error);
            }
          }}>
            <Text className=' text-white font-bold' >Log in</Text>
          </Pressable>
        </View>
        <View className="mt-8">
          <Text
            className="text-center font-medium text-blue-500"
            onPress={() => router.push("/sign-up")}
          >
            Click Here To Create A New Account
          </Text>
        </View>
      </View>
    </>
  );
}