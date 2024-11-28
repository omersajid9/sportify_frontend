import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Octicons } from '@expo/vector-icons';
import { SearchBarBaseProps } from 'react-native-elements/dist/searchbar/SearchBar';
import axios from 'axios';
import { GOOGLE_PLACES_API_KEY } from '../app.config';
import { GestureHandlerRootView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';

const SafeSearchBar = (SearchBar as unknown) as React.FC<SearchBarBaseProps>;

interface GoogleSearchPlacesProps {
    setPredictions: any;
    query: string;
    setQuery: any;
    placeholder: string;
    refreshLocation: any;
}

export default function GoogleSearchPlaces({ setPredictions, query, setQuery, placeholder, refreshLocation }: GoogleSearchPlacesProps) {
    const searchPlaces = async (text: any) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GOOGLE_PLACES_API_KEY}&language=en`
            );
            var data = response.data.predictions;
            if (data) {
                setPredictions(data);
            } else {
                setPredictions([]);
            }
        } catch (error) {
            console.error('Error fetching predictions:', error);
        }
    };

    const updateSearch = (text: any) => {
        setQuery(text);
        searchPlaces(text);
    };

    return (
        <View className="flex-1 justify-center items-center" >
            {/* <TextInput 
            cancelsTouchesInView={true}
            className='text-lg '
            style={{ textAlignVertical: 'center' }}
                placeholder={placeholder}
                value={query}
                onChangeText={updateSearch}
            /> */}
            <SafeSearchBar
                platform="ios"
                placeholder={placeholder}
                value={query}
                onChangeText={updateSearch}
                searchIcon={<Pressable onPress={refreshLocation}><Octicons name="location" size={20} color="black" /></Pressable>}
                clearIcon={false}
                inputContainerStyle={styles.inputContainer}
                containerStyle={styles.searchBarContainer}
                rightIconContainerStyle={styles.rightIcon}
                inputStyle={styles.inputText}
                clearTextOnFocus={false}
                placeholderTextColor={'black'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    searchBarContainer: {
        backgroundColor: 'transparent',
    },
    inputText: {
        textAlignVertical: 'center',
        alignItems: 'center',

        color: 'green',
    },
    inputContainer: {
        textAlignVertical: 'center',
        backgroundColor: 'transparent',
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        paddingVertical: 3,
        justifyContent: 'center',
        alignContent: 'center',
        // borderColor: 'rgb(30 58 138)',
        // borderWidth: 2,
        // borderBottomWidth: 2,
        overflow: 'hidden',
        // fontSize: 18,
        // lineHeight: 28,
        color: 'black',
        tintColor: 'black',

    },
    rightIcon: {
        justifyContent: 'center',
    },
});