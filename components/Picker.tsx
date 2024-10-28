// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Animated,
//   NativeSyntheticEvent,
//   NativeScrollEvent,
//   Vibration,
//   Platform,
// } from 'react-native';
// import * as Haptics from 'expo-haptics';

// // import 'react-native-re'

// // import Sound from 'react-native-sound';

// // // Initialize sound
// // Sound.setCategory('Playback');
// // const clickSound = new Sound('click.mp3', Sound.MAIN_BUNDLE, (error) => {
// //   if (error) {
// //     console.log('Failed to load sound', error);
// //   }
// // });

// interface WheelPickerProps<T> {
//   items: T[];
//   initialIndex?: number;
//   onValueChange?: (value: T, index: number) => void;
//   renderItem: (item: T, isSelected: boolean, onPress: () => void) => React.ReactNode;
//   itemHeight?: number;
//   visibleItems?: number;
//   hapticFeedback?: boolean;
//   soundFeedback?: boolean;
// }

// function WheelPicker<T>({
//   items,
//   initialIndex = 0,
//   onValueChange,
//   renderItem,
//   itemHeight = 44,
//   visibleItems = 5,
//   hapticFeedback = true,
//   soundFeedback = true,
// }: WheelPickerProps<T>): JSX.Element {
//   const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex);
//   const scrollViewRef = useRef<ScrollView | null>(null);
//   const lastOffsetRef = useRef<number>(initialIndex * itemHeight);
  
//   const containerHeight = itemHeight * visibleItems;
//   const paddingTop = (containerHeight - itemHeight) / 2;

//   const playFeedback = () => {
//     // const itemsScrolled = Math.abs(Math.round(scrollDistance / itemHeight));
//     console.log("A")
//     Haptics.selectionAsync();
//   };
  
//   const handleScroll = Animated.event(
//     [{ nativeEvent: { contentOffset: { y: new Animated.Value(0) } } }],
//     {
//       useNativeDriver: false,
//       listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//         const offsetY = event.nativeEvent.contentOffset.y;
//         const index = Math.round(offsetY / itemHeight);
        
//         if (index !== selectedIndex && index >= 0 && index < items.length) {
//           // Calculate scroll distance and trigger feedback
//           const scrollDistance = offsetY - lastOffsetRef.current;
//           playFeedback();
          
//           // Update state and refs
//           setSelectedIndex(index);
//           lastOffsetRef.current = offsetY;
//           onValueChange?.(items[index], index);
//         }
//       },
//     }
//   );

//   const scrollToIndex = (index: number): void => {
//     const targetOffset = index * itemHeight;
//     const scrollDistance = targetOffset - lastOffsetRef.current;
    
//     scrollViewRef.current?.scrollTo({
//       y: targetOffset,
//       animated: true,
//     });
    
//     playFeedback();
//     lastOffsetRef.current = targetOffset;
//   };

//   const handleItemPress = (index: number): void => {
//     console.log("INDEX", index)
//     setSelectedIndex(index);
//     scrollToIndex(index);
//     // onValueChange?.(items[index], index);
//   };

//   const defaultRenderItem = (item: T, index: number): JSX.Element => {
//     const isSelected = index === selectedIndex;
    
//     return (
//       <TouchableOpacity
//         key={index}
//         onPress={() => handleItemPress(index)}
//         className={` items-center justify-center px-4 ${
//           isSelected ? 'opacity-100' : 'opacity-40'
//         }`}
//         style={{ height: itemHeight }}
//       >
//         <Text
//           className={`text-base ${
//             isSelected ? 'font-semibold text-black' : 'font-normal text-gray-600'
//           }`}
//         >
//           {String(item)}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View className="relative">
//       <View 
//         className="absolute w-full h-[1px] bg-gray-200" 
//         style={{ top: paddingTop + itemHeight }} 
//       />
//       <View 
//         className="absolute w-full h-[1px] bg-gray-200" 
//         style={{ top: paddingTop + itemHeight * 2 }} 
//       />
      
//       <ScrollView
//         ref={scrollViewRef}
//         showsVerticalScrollIndicator={false}
//         snapToInterval={itemHeight}
//         decelerationRate={.5}
//         onScroll={handleScroll}
//         // scrollEventThrottle={16}
//         className="bg-white"
//         contentContainerStyle={{
//           paddingTop,
//           paddingBottom: paddingTop,
//         }}
//       >
//         {items.map((item, index) => 
//         //   renderItem ? 
//             renderItem(item, index === selectedIndex, () => handleItemPress(index)) 
//             // : 
//             // defaultRenderItem(item, index)
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// interface ExampleItem {
//     id: number;
//     label: string;
//   }

  
// const App: React.FC = () => {
//     const items: ExampleItem[] = [
//       { id: 1, label: 'hello' },
//       { id: 2, label: 'world' },
//       { id: 3, label: 'react' },
//       { id: 4, label: 'native' },
//       { id: 5, label: 'picker' },
//     ];
    
//     const handleValueChange = (item: ExampleItem, index: number): void => {
//       console.log('Selected:', item.label, 'at index:', index);
//     };
  
//     // Custom render function example with proper scroll handling
//     const customRenderItem = (
//       item: ExampleItem, 
//       isSelected: boolean, 
//       onPress: () => void
//     ): JSX.Element => (
//       <TouchableOpacity
//         key={item.id}
//         className={` items-center justify-center h-[24px] px-4  ${
//           isSelected ? 'opacity-100 ' : 'opacity-40'
//         }`}
//         onPress={onPress}
//       >
//         <Text
//           className={`text-base ${
//             isSelected ? 'font-semibold text-black' : 'font-normal text-gray-600'
//           }`}
//         >
//           {item.label}
//         </Text>
//       </TouchableOpacity>
//     );
  
//     return (
//       <View className="flex-1 justify-center items-center bg-white">
//         <View className="w-48 h-48 border-2">
//           <WheelPicker<ExampleItem>
//             items={items}
//             initialIndex={0}
//             onValueChange={handleValueChange}
//             renderItem={customRenderItem}
//           />
//         </View>
//       </View>
//     );
//   };
  

// export default App;