# Install the Expo and React Native-related dependencies with expo install to ensure version compatibility
npx expo install \
  expo-constants \
  expo-linking \
  expo-location \
  expo-secure-store \
  expo-status-bar \
  react-native-gesture-handler \
  react-native-reanimated \
  react-native-safe-area-context \
  react-native-screens \
  react-native-maps@1.14.0 \
  react-native-pager-view \
  @react-native-community/datetimepicker

# Install the remaining dependencies with npm install
npm install \
  @react-native-picker/picker \
  @react-navigation/material-top-tabs \
  @shopify/flash-list \
  @tanstack/react-query \
  axios \
  expo-router \
  nativewind \
  react-native-actions-sheet@^0.9.7 \
  react-native-elements \
  react-native-google-places-autocomplete@2.5.6 \
  tailwindcss
