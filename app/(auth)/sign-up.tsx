import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, Platform, Button, Pressable, ScrollView, ActionSheetIOS } from 'react-native';
import { useAuth } from '../context/auth';
import { Stack, useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';

const SignUp = () => {
  const today = new Date();
  const minimumDate = new Date(today.setFullYear(today.getFullYear() - 13));
  const { signUp } = useAuth();
  const userNameRef = useRef<string>('');
  const passwordRef = useRef<string>('');
  const router = useRouter();


  const baseUrl = "https://mact-profile-avatar.s3.us-east-1.amazonaws.com/images/id/AV";
  const avatars: number[] = [];

  for (let i = 1; i <= 100; i += 4) {
    avatars.push(i);
  }

  function convertToImageUrl(id: number) {
    return `${baseUrl}${id}.png`;
  }
  const [selectedAvatar, setSelectedAvatar] = useState<string>(convertToImageUrl(1));

  return (
    <View className="justify-center items-center flex-1">
      <Stack.Screen options={{ title: "Sign Up" }} />
      {/* Username Input */}
      <View className="mb-4 w-3/4">
        <Text className="text-lg mb-2 text-blue-900">Username</Text>
        <TextInput
          placeholderTextColor={'grey'}
          placeholder="Username"
          autoCapitalize="none"
          nativeID="userName"
          onChangeText={(text) => {
            userNameRef.current = text;
          }}
          className="border border-blue-900 rounded px-2 py-1 mb-4"
        />
      </View>

      {/* Password Input */}
      <View className="mb-4 w-3/4">
        <Text className="text-lg mb-2 text-blue-900">Password</Text>
        <TextInput
          placeholderTextColor={'grey'}
          placeholder="Password"
          secureTextEntry={true}
          nativeID="password"
          onChangeText={(text) => {
            passwordRef.current = text;
          }}
          className="border border-blue-900 rounded px-2 py-1 mb-4"
        />
      </View>


      <View className="mb-4 w-3/4">
        <Text className="text-lg mb-2 text-blue-900">Profile Picture</Text>
        <FlashList
          estimatedItemSize={50}
          data={avatars}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity onPress={() => setSelectedAvatar(convertToImageUrl(item))}>
                <Image
                  source={{ uri: convertToImageUrl(item) }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    borderColor: selectedAvatar === convertToImageUrl(item) ? 'blue' : 'transparent',
                    borderWidth: 2,
                    margin: 5,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedAvatar(convertToImageUrl(item + 1))}>
                <Image
                  source={{ uri: convertToImageUrl(item + 1) }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    borderColor: selectedAvatar === convertToImageUrl(item + 1) ? 'blue' : 'transparent',
                    borderWidth: 2,
                    margin: 5,
                  }}
                />
              </TouchableOpacity>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>


      <View className=' mt-3 justify-center items-center'>
        <Pressable className=' p-4 bg-blue-900 rounded-lg' onPress={async () => {
          if (userNameRef.current.length < 3) {
            Alert.alert("Username must be at least 3 characters long");
            return;
          }
          if (passwordRef.current.length < 8) {
            Alert.alert("Password must be at least 8 characters long");
            return;
          }
          const { data, error } = await signUp(
            userNameRef.current,
            passwordRef.current,
            selectedAvatar
          );
          if (data) {
            router.navigate("/");
          } else {
          }
        }}>
          <Text className=' text-white font-bold' >Sign up</Text>
        </Pressable>
      </View>

      <View className="mt-8">
        <Text
          className="text-center font-medium text-blue-500"
          onPress={() => router.navigate("/sign-in")}
        >
          Click Here To Return To Sign In Page
        </Text>
      </View>
    </View >
  );
};

export default SignUp;
