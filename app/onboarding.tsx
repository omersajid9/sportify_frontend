import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';


const onboardingData = [
  {
    title: 'Welcome to Our App',
    description: 'Discover amazing features that will transform your experience.',
  },
  {
    title: 'Easy Navigation',
    description: 'Seamlessly move through different sections with intuitive design.',
  },
  {
    title: 'Get Started',
    description: 'You\'re all set! Tap Continue to explore the app.',
  }
];

const OnboardingScreen: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const handleNextPage = () => {
    if (currentPage < onboardingData.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    }
  };

  const handleFinish = () => {
    // Navigate to main app or login screen
    console.log('Onboarding complete');
  };

  const {uri} = Image.resolveAssetSource(require('../assets/1.svg'))


  return (
    <SafeAreaView className="flex-1 bg-[#F2F2F2]">
      <PagerView
        ref={pagerRef}
        style={{ height: '100%', flex: 1 }}
        // className="h-full flex-1 border-2"
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {onboardingData.map((page, index) => (
          <View
            key={index}
            className="flex items-center justify-center px-6 h-full "
          >
          <SvgUri
              width="100%"
              height="100%"
              color={'green'}
              fill={'green'}
              stroke={'#1e3a8a'}
              // style={{ width: 256, height: 256, marginBottom: 32 }}
              uri={uri}
            />
            {/* <Image 
              source={{uri: "/assets/1.svg"}} 
              className="w-64 h-64 mb-8" 
              resizeMode="contain" 
            /> */}
            <Text className="text-3xl font-bold text-center mb-4">
              {page.title}
            </Text>
            <Text className="text-lg text-gray-600 text-center">
              {page.description}
            </Text>
          </View>
        ))}
      </PagerView>

      {/* Page Indicator */}
      <View className="flex-row justify-center mb-8">
        {onboardingData.map((_, index) => (
          <View
            key={index}
            className={`w-3 h-3 rounded-full mx-2 ${currentPage === index ? 'bg-blue-900' : 'bg-gray-300'
              }`}
          />
        ))}
      </View>

      {/* Navigation Buttons */}
      <View className="flex-row justify-between px-6 pb-6">
        {currentPage > 0 && (
          <TouchableOpacity
            onPress={() => pagerRef.current?.setPage(currentPage - 1)}
            className="px-4 py-2 rounded-lg"
          >
            <Text className="text-blue-900 text-lg">Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={
            currentPage === onboardingData.length - 1
              ? handleFinish
              : handleNextPage
          }
          className="px-6 py-3 bg-blue-900 rounded-lg ml-auto"
        >
          <Text className="text-white text-lg">
            {currentPage === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;