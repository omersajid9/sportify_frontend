// import React, { useCallback, useState } from 'react';
// import { View, StyleSheet, Pressable } from 'react-native';
// import { SearchBar } from 'react-native-elements';
// import { Octicons } from '@expo/vector-icons';
// import { SearchBarBaseProps } from 'react-native-elements/dist/searchbar/SearchBar';
// import axios from 'axios';
// import { GOOGLE_PLACES_API_KEY } from '../app.config';
// import { GestureHandlerRootView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';

// const SafeSearchBar = (SearchBar as unknown) as React.FC<SearchBarBaseProps>;

// interface GoogleSearchPlacesProps {
//     setPredictions: any;
//     query: string;
//     setQuery: any;
//     placeholder: string;
//     refreshLocation: any;
// }

// export default function GoogleSearchPlaces({ setPredictions, query, setQuery, placeholder, refreshLocation }: GoogleSearchPlacesProps) {
//     const searchPlaces = async (text: any) => {
//         try {
//             const response = await axios.get(
//                 `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GOOGLE_PLACES_API_KEY}&language=en`
//             );
//             var data = response.data.predictions;
//             if (data) {
//                 setPredictions(data);
//             } else {
//                 setPredictions([]);
//             }
//         } catch (error) {
//             console.error('Error fetching predictions:', error);
//         }
//     };

//     const updateSearch = (text: any) => {
//         setQuery(text);
//         searchPlaces(text);
//     };

//     return (
//         <View className="flex-1 justify-center items-center" >
//             <SafeSearchBar
//                 platform="ios"
//                 placeholder={placeholder}
//                 value={query}
//                 onChangeText={updateSearch}
//                 searchIcon={<Pressable onPress={refreshLocation}><Octicons name="location" size={20} color="black" /></Pressable>}
//                 clearIcon={false}
//                 inputContainerStyle={styles.inputContainer}
//                 containerStyle={styles.searchBarContainer}
//                 rightIconContainerStyle={styles.rightIcon}
//                 textAlignVertical='center'
//                 // inputContainerStyle={styles.inputContainer}
//                 // containerStyle={styles.searchBarContainer}
//                 // rightIconContainerStyle={styles.rightIcon}
//                 // inputStyle={styles.inputText}
//                 placeholderTextColor={'black'}
//             />
//         </View>
//     );
// }

// // const styles = StyleSheet.create({
// //     searchBarContainer: {
// //         backgroundColor: 'transparent',
// //         justifyContent: 'center', // Centers content vertically in the container
// //         alignItems: 'center',
// //     },
// //     inputText: {
// //         textAlignVertical: 'center', // Ensures text is vertically centered
// //         color: '#222222',
// //         justifyContent: 'center', // Centers content vertically in the container
// //         alignItems: 'center',
// //         marginBottom: 5
// //     },
// //     inputContainer: {
// //         backgroundColor: 'transparent',
// //         borderRadius: 8,
// //         flex: 1,
// //         // height: 40, // Controls the height of the input container
// //         paddingVertical: 5, // Adjust padding as needed
// //         justifyContent: 'center', // Centers content vertically in the container
// //         alignItems: 'center',
// //         overflow: 'hidden',
// //     },
// //     rightIcon: {
// //         justifyContent: 'center',
// //     },
// // });

// const styles = StyleSheet.create({
//     searchBarContainer: {
//         backgroundColor: '#F2F2F2',
//         textAlignVertical: 'center',
//         // borderWidth: 2,
//         // borderColor: 'black',
//         // height: 50,

//     },
//     inputContainer: {
//         backgroundColor: '#F2F2F2',
//         textAlignVertical: 'center',
//         //   backgroundColor: '#EAEAEA',

//         // height: 50,
//           flex: 1
//         //   paddingHorizontal: 5,
//         //   borderColor: 'rgb(30 58 138)',
//         //   borderWidth: 2,
//         //   borderBottomWidth: 2
//     },
//     rightIcon: {
//         justifyContent: 'center',
//     },
// });








import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, TextInput, Pressable, Keyboard, StyleSheet } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import axios from 'axios';
import { GOOGLE_PLACES_API_KEY } from '../app.config';

interface GoogleSearchPlacesProps {
    setPredictions: (predictions: any[]) => void;
    query: string;
    setQuery: (query: string) => void;
    placeholder: string;
    refreshLocation: () => void;
}

export default function GoogleSearchPlaces({
    setPredictions,
    query,
    setQuery,
    placeholder,
    refreshLocation,
}: GoogleSearchPlacesProps) {
    const [isTyping, setIsTyping] = useState(false);

    // Shared value for input width animation
    const inputWidth = useSharedValue(1);

    const searchPlaces = async (text: string) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GOOGLE_PLACES_API_KEY}&language=en`
            );
            const data = response.data.predictions || [];
            setPredictions(data);
        } catch (error) {
            console.error('Error fetching predictions:', error);
        }
    };

    const updateSearch = (text: string) => {
        setQuery(text);
        searchPlaces(text);
    };

    useEffect(() => {
        if (query.length > 0) {
            setIsTyping(true);
        } else {
            setIsTyping(false);
        }
    }, [query])

    const handleFocus = () => {
        setIsTyping(true);
        // inputWidth.value = withTiming(1.3, { duration: 1000 });
    };

    const handleBlur = () => {
        if (query.length === 0) {
            setIsTyping(false);
            // inputWidth.value = withTiming(1, { duration: 1000 });
        }
    };

    const clearSearch = () => {
        Keyboard.dismiss();
        setQuery('');
        setPredictions([]);
        inputWidth.value = withTiming(1, { duration: 300 });
        setIsTyping(false);
    };

    const animatedInputStyle = useAnimatedStyle(() => ({
        flex: inputWidth.value,
    }));

    return (
        <View className="flex flex-row flex-grow flex-shrink items-center gap-1 px-2 ">
            {/* <View className=" h-full flex-row items-center bg-[#F2F2F2] rounded-lg justify-between"> */}
                <Pressable onPress={refreshLocation} className="">
                    <Octicons name="location" size={20} color="#222222" />
                </Pressable>

                <Animated.View style={animatedInputStyle} className="  h-full flex flex-grow flex-shrink">
                    <TextInput
                        value={query}
                        onChangeText={updateSearch}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        // numberOfLines={1}
                        style={styles.textInput}
                        
                        // textAlignVertical="center" 
                        // multiline={true}
                        placeholderTextColor="#222222"
                        // scrollEnabled={false}
                        // className=' flex border-2 h-full '
                        className=" text-[#222222]  px-2 h-full bg-[#F2F2F2]"
                    />
                </Animated.View>
                {isTyping && (
                    <Pressable onPress={clearSearch} className="">
                        <Octicons name="x" size={30} color="black" />
                    </Pressable>
                )}
            {/* </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
       flex: 1,
    //    justifyContent: 'center',
    //    alignItems: 'center',
    },
    textInput: {
        fontSize: 16
        // height: '100%',
        // width: '100%',
    //    justifyContent: 'center',
    //    alignItems: 'center',
    //    alignSelf: 'center',
    // paddingVertical: 0,
    //    textAlignVertical: 'center',
    
    //    padding: 0,
    //    verticalAlign: 'middle',
    //    overflow: 'scroll'
       
    //    borderWidth: 2,
    //    borderColor: 'black'
    //    justifyContent: 'flex-start'
    }
   
   });