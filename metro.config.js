const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname)

module.exports = withNativeWind(config, { input: './global.css' })

// const {
//     wrapWithReanimatedMetroConfig,
// } = require('react-native-reanimated/metro-config');

// module.exports = wrapWithReanimatedMetroConfig(config);