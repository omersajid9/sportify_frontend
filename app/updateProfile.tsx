import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, Pressable } from 'react-native';
// import { useAuth } from '../context/auth';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useAuth } from './context/auth';
import axiosInstance from '../services/api';

const UpdateProfile = () => {
      const { user, editProfile } = useAuth();
    const router = useRouter();

    const [username, setUsername] = useState<string>(user?.username ?? '');
    const [password, setPassword] = useState<string>('');

    const baseUrl = "https://mact-profile-avatar.s3.us-east-1.amazonaws.com/images/id/AV";
    const avatars: number[] = [];

    for (let i = 1; i <= 100; i += 4) {
        avatars.push(i);
    }

    function convertToImageUrl(id: number) {
        return `${baseUrl}${id}.png`;
    }

    const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(user?.profile_picture);


    const handleUpdate = async () => {
        if (!user) {
            return;
        }

        const data = {
            user_id: user.id,
            username: username.length > 3 ? username : undefined,
            password: password.length > 3 ? password : undefined,
            profile_picture: selectedAvatar,
        };

        editProfile(data);
      router.navigate("/profile");
};

return (
    <View className="justify-center items-center my-4">
        <View className="mb-4 w-3/4">
            <Text className="text-lg mb-2 text-blue-900">Username</Text>
            <TextInput
                placeholderTextColor={'grey'}
                placeholder="Update Username"
                autoCapitalize="none"
                nativeID="userName"
                value={username}
                onChangeText={setUsername}
                className="w-full py-3 border-2 border-blue-900 rounded-lg px-4 "
                />
        </View>

        <View className="mb-4 w-3/4">
            <Text className="text-lg mb-2 text-blue-900">Password (Optional)</Text>
            <TextInput
                placeholderTextColor={'grey'}
                placeholder="Update Password"
                secureTextEntry={true}
                nativeID="password"
                onChangeText={setPassword}
                className="w-full py-3 border-2 border-blue-900 rounded-lg px-4 "
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

        <View className="mt-3 justify-center items-center">
            <Pressable
                className="p-4 bg-blue-900 rounded-lg"
                onPress={handleUpdate}
            >
                <Text className="text-white font-bold">Update Profile</Text>
            </Pressable>
        </View>

    </View>
);
};

export default UpdateProfile;
