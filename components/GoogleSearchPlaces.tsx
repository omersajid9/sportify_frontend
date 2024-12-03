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
                // inputContainerStyle={styles.inputContainer}
                // containerStyle={styles.searchBarContainer}
                // rightIconContainerStyle={styles.rightIcon}
                // inputStyle={styles.inputText}
                clearTextOnFocus={false}
                placeholderTextColor={'black'}
            />
        </View>
    );
}

// const styles = StyleSheet.create({
//     searchBarContainer: {
//         backgroundColor: 'transparent',
//         justifyContent: 'center', // Centers content vertically in the container
//         alignItems: 'center',
//     },
//     inputText: {
//         textAlignVertical: 'center', // Ensures text is vertically centered
//         color: '#222222',
//         justifyContent: 'center', // Centers content vertically in the container
//         alignItems: 'center',
//         marginBottom: 5
//     },
//     inputContainer: {
//         backgroundColor: 'transparent',
//         borderRadius: 8,
//         flex: 1,
//         // height: 40, // Controls the height of the input container
//         paddingVertical: 5, // Adjust padding as needed
//         justifyContent: 'center', // Centers content vertically in the container
//         alignItems: 'center',
//         overflow: 'hidden',
//     },
//     rightIcon: {
//         justifyContent: 'center',
//     },
// });

const styles = StyleSheet.create({
    searchBarContainer: {
      backgroundColor: 'transparent',
    },
    inputContainer: {
        backgroundColor: 'transparent',
    //   backgroundColor: '#EAEAEA',
      borderRadius: 20,
      height: 40,
    //   flex: 1
    //   paddingHorizontal: 5,
    //   borderColor: 'rgb(30 58 138)',
    //   borderWidth: 2,
    //   borderBottomWidth: 2
    },
    rightIcon: {
      justifyContent: 'center',
    },
  });