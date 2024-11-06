import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, Platform, Button, Pressable, ScrollView, ActionSheetIOS } from 'react-native';
import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useAuth } from '../context/auth';
import { Stack, useRouter } from 'expo-router';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
// import { GestureHandlerRootView, NativeViewGestureHandler, ScrollView } from 'react-native-gesture-handler';

const SignUp = () => {
  const today = new Date();
  const minimumDate = new Date(today.setFullYear(today.getFullYear() - 13));
  const { signUp } = useAuth();
  const userNameRef = useRef<string>('');
  const passwordRef = useRef<string>('');
  const dateOfBirthRef = useRef<ActionSheetRef>(null);
  const dateRef = useRef<Date>(minimumDate);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('https://avatar.iran.liara.run/public/22');
  const [time, setTime] = useState<Date>(minimumDate);
  const router = useRouter();

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: dateRef?.current,
      onChange: (event: any, selectedDate: any) => {
        if (event.type === 'set') {
          dateRef.current = selectedDate;
        }
      },
      mode: 'date',
      is24Hour: true,
    });
  };

  const onChangeTimePicker = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || time;
    setTime(currentDate);
    dateRef.current = currentDate;
  };

  const avatars = [
    'https://avatar.iran.liara.run/public/22',
    'https://avatar.iran.liara.run/public/34',
    'https://avatar.iran.liara.run/public/10',
    'https://avatar.iran.liara.run/public/92',
    'https://avatar.iran.liara.run/public/96',
    'https://avatar.iran.liara.run/public/95'
  ];

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



      {/* Date of Birth Picker */}
      <View className="mb-4 w-3/4">
        <Text className="text-lg mb-2 text-blue-900">Date of Birth</Text>
        {Platform.OS == 'ios' ?
                <View>
                <View className=' mb-6 '>
                  <Text className='text-lg mb-2'>{time.toDateString()}</Text>
                  <View className='justify-center items-center'>
                    <Pressable className=' p-4 bg-blue-900 rounded-lg ' onPress={() => dateOfBirthRef.current?.show()}>
                      <Text className=' text-white font-bold' >Pick a time</Text>
                    </Pressable>
                  </View>
                </View>
                <ActionSheet
                  ref={dateOfBirthRef}
                  enableGesturesInScrollView={true}
                  containerStyle={{
                    height: 250,
                    backgroundColor: 'white'
                  }}
                  indicatorStyle={{
                    width: 100,
                    maxHeight: 200
                  }}>
                  <RNDateTimePicker
                    textColor='black'
                    testID="dateTimePicker"
                    value={time}
                    minimumDate={minimumDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onChangeTimePicker}
                  />
                </ActionSheet>
              </View>        
          :
          <View className=' mt-3 justify-center items-center'>
            <Pressable className=' p-4 bg-blue-900 rounded-lg' onPress={showDatePicker}>
              <Text className=' text-white font-bold' >Pick a date</Text>
            </Pressable>
          </View>
        }
      </View>

      {/* Avatar Selection */}
      <View className="mb-4 w-3/4">
        <Text className="text-lg mb-2 text-blue-900">Profile Picture</Text>
        <ScrollView className='flex-row' horizontal showsHorizontalScrollIndicator={false}>
          {avatars.map((avatar, index) => (
            <TouchableOpacity key={index} onPress={() => setSelectedAvatar(avatar)}>
              <Image
                source={{ uri: avatar }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  borderColor: selectedAvatar === avatar ? 'blue' : 'transparent',
                  borderWidth: 2,
                  marginHorizontal: 10
                }}
              />
            </TouchableOpacity>
          ))}

        </ScrollView>
      </View>


      <View className=' mt-3 justify-center items-center'>
        <Pressable className=' p-4 bg-blue-900 rounded-lg' onPress={async () => {
          const date_of_birth = dateRef.current.toISOString().split('T')[0];
          const { data, error } = await signUp(
            userNameRef.current,
            passwordRef.current,
            date_of_birth,
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
