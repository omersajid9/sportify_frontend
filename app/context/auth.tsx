import axios from "axios";
import { useRootNavigation, useRouter, useSegments } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { BASE_URL } from "../../app.config";
import { getValueFor, save } from "./store";
import Location, {getCurrentPositionAsync, getLastKnownPositionAsync, requestForegroundPermissionsAsync } from "expo-location";

// Define the AuthContextValue interface
interface SignInResponse {
  data?: string;
  error?: Error | string;
}

interface SignOutResponse {
  error: any | undefined;
  data: {} | undefined;
}

interface AuthContextValue {
  signIn: (e: string, p: string) => Promise<SignInResponse>;
  signUp: (username: string, password: string, date_of_birth: string, profile_picture: string) => Promise<SignInResponse>;
  signOut: () => Promise<SignOutResponse>;
  user: string | null;
  location: Location | null;
  authInitialized: boolean;
}

// Define the Provider component
interface ProviderProps {
  children: React.ReactNode;
}

interface Location {
  lat: number;
  lng: number;
}

// Create the AuthContext
const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

export function Provider(props: ProviderProps) {
  const [user, setAuth] = React.useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = React.useState<boolean>(false);
  const [location, setLocation] = React.useState<Location | null>(null);

  const useProtectedRoute = (user: string | null) => {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
      const inAuthGroup = segments[0] === "(auth)";
      if (!authInitialized) return;
      if (
        !user &&
        !inAuthGroup
      ) {
        router.replace('/sign-in');
      } else if (user && inAuthGroup) {
        router.replace("/");
      }
    }, [user, segments, authInitialized]);
  };

  const getLocation = async () => {
    const { status } = await requestForegroundPermissionsAsync();
    if (status === 'granted') {
      var locationData = await getLastKnownPositionAsync({});
      if (!locationData) {
        locationData = await getCurrentPositionAsync({});
      }
      const { latitude, longitude } = locationData.coords;
      var newLocation = {lat: locationData.coords.latitude, lng: locationData.coords.longitude};

      if (!location || location.lat !== latitude || location.lng !== longitude) {
        setLocation(newLocation);
        // await save("location", JSON.stringify(newLocation));
      }
    } else {
      Alert.alert("Permission Denied", "Location permissions are required to use this feature.");
    }
  };


  useEffect(() => {
    const init = async () => {
      const store_user = await getValueFor("user");
      // const store_location = await getValueFor("location");
      
      // if (store_location) {
      //   setLocation(JSON.parse(store_location));
      // } else {
        await getLocation();
      // }
      if (store_user) {
        setAuth(store_user);
      }
      // setAuth('omer');
      setAuthInitialized(true);
    }
    init();
  }, []);

  /**
   *
   * @returns
   */
  const logout = async (): Promise<SignOutResponse> => {
    save("user", null);
    setAuth(null);
    return { error: undefined, data: "done" }
  };
  /**
   *
   * @param email
   * @param password
   * @returns
   */
  const login = async (
    username: string,
    password: string
  ): Promise<SignInResponse> => {
    try {
      // Make the POST request to the sign-in route
      const response = await axios.post(BASE_URL + '/player/sign-in', { username: username, password: password });

      if (response.status === 200) {
        // Alert.alert("Login", "Login successful");
        setAuth(username);
        save("user", username);
        return { data: username, error: undefined };
      } else {
        save("user", null);
        setAuth(null);
        return { error: "Something went wrong with request", data: undefined };
      }
    } catch (error: any) {
      save("user", null);
      if (error.response && error.response.status === 401) {
        Alert.alert("Login Failed", "Invalid username or password");
        return { error: "Invalid username or password", data: undefined };
      } else {
        Alert.alert("Login Failed", " Something went wrong");
        return { error: "Something went wrong", data: undefined };
      }
    }
  };

  /**
   * 
   * @param email 
   * @param password 
   * @param username 
   * @returns 
   */
  const createAcount = async (
    username: string,
    password: string,
    date_of_birth: string,
    profile_picture: string,
  ): Promise<SignInResponse> => {
    try {
      // Make the POST request to the sign-up route
      const response = await axios.post(BASE_URL + '/player/sign-up', {
        username: username,
        password: password,
        date_of_birth: date_of_birth,
        profile_picture: profile_picture
      });

      // Handle success response
      if (response.status === 201) {
        // Alert.alert("Account Created", "Your account has been created successfully");
        setAuth(username);  // Set auth context or token as needed
        save("user", username);
        return { data: username, error: undefined };
      } else {
        save("user", null);
        Alert.alert("Sign Up Failed", "Something went wrong");
        return { error: "Something went wrong", data: undefined };
      }
    } catch (error: any) {
      save("user", null);
      // Handle errors
      if (error.response && error.response.status === 409) {
        // Conflict (username already exists)
        Alert.alert("Sign Up Failed", "Username already taken");
        return { error: "Username already taken", data: undefined };
      } else {
        // Other errors
        Alert.alert("Sign Up Failed", "Something went wrong");
        return { error: "Something went wrong", data: undefined };
      }
    }
  };

  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        signIn: login,
        signOut: logout,
        signUp: createAcount,
        user,
        location,
        authInitialized,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// Define the useAuth hook
export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }

  return authContext;
};
