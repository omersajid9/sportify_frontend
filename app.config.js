module.exports = {
    // Environment variables
    // BASE_URL: "http://10.0.0.171:8080",
    BASE_URL: "https://www.omerbackend.store",
    GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY || "AIzaSyDAQ2bdLjVK52X8cu8ZeuLKU_wbl-gcNTs",
    expo: {
      name: "mact",
      slug: "mact",
      version: "1.0.7",
      orientation: "portrait",
      icon: "./assets/icon.png",
      scheme: "exp+tempty",
      newArchEnabled: true,
      userInterfaceStyle: "light",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      updates: {
        fallbackToCacheTimeout: 0
      },
      assetBundlePatterns: [
        "**/*"
      ],
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.omersajid9.mact",
        infoPlist: {
          NSLocationAlwaysAndWhenInUseUsageDescription: "Allowing location access helps us suggest nearby sports sessions and games so you can connect with players and join activities happening around you.",
          NSLocationWhenInUseUsageDescription: "Allowing location access helps us suggest nearby sports sessions and games so you can connect with players and join activities happening around you.",
          NSLocationAlwaysUsageDescription: "Allowing location access helps us suggest nearby sports sessions and games so you can connect with players and join activities happening around you.",
        }
      },
      
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#ffffff"
        },
        permissions: [
          "android.permission.ACCESS_COARSE_LOCATION",
          "android.permission.ACCESS_FINE_LOCATION"
        ],
        package: "com.omersajid9.mact"
      },
      
      plugins: [
        "expo-router",
        [
          "expo-location",
          {
            locationAlwaysAndWhenInUsePermission: "Allowing location access helps us suggest nearby sports sessions and games so you can connect with players and join activities happening around you."
          }
        ],
        "expo-secure-store"
      ],
      
      extra: {
        eas: {
          projectId: "96aa4bb0-df91-4f7c-9dd1-360cb6dcb2e5"
        }
      }
    }
};