import axios from "axios";
import { router, useRouter, useSegments } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { BASE_URL } from "../../app.config";
import { getValueFor, save } from "./store";
import Location, { getCurrentPositionAsync, getLastKnownPositionAsync, requestForegroundPermissionsAsync } from "expo-location";
import axiosInstance from "../../services/api";

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
  signUp: (username: string, password: string, profile_picture: string) => Promise<SignInResponse>;
  signOut: (remove_token: boolean) => Promise<SignOutResponse>;
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
      const reStoreUser = async () => {
        const store_user = await getValueFor("user");
        if (user && store_user != user) {
          if (store_user) {
            setAuth(store_user);
          } else {
            setAuth(null);
          }
        }
      };
      reStoreUser();
    }, [])


    useEffect(() => {
      const inAuthGroup = segments[0] === "(auth)";
      if (!authInitialized) return;
      if (
        !user &&
        !inAuthGroup
      ) {
        router.navigate('/sign-in');
      } else if (user && inAuthGroup) {
        router.navigate("/");
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
      var newLocation = { lat: locationData.coords.latitude, lng: locationData.coords.longitude };

      if (!location || location.lat !== latitude || location.lng !== longitude) {
        setLocation(newLocation);
      }
    } else {
      Alert.alert("Permission Denied", "Location permissions are required to use this feature.");
    }
  };


  useEffect(() => {
    const init = async () => {
      const store_user = await getValueFor("user");
      await getLocation();
      if (store_user) {
        setAuth(store_user);
      } else {
        setAuth(null);
      }
      // logout();
      // setAuth(null);
      setAuthInitialized(true);
    }
    init();
  }, []);


  const removeNotificationToken = async () => {
    const token = await getValueFor("notification_token");
    const user = await getValueFor("user");
    if (token && user) {
      try {
        const data = {
          username: user,
          token: token
        }
        const response = await axiosInstance.post('/notification/remove_token', data, {
          headers: {
            'Content-Type': 'application/json', // Ensure the request is in JSON format
          }
        });
      } catch (error) {
        console.error('Error saving notification token:', error);
      }
    }
  }

  async function saveNotificationToken() {
    const token = await getValueFor("notification_token");
    const user = await getValueFor("user");
    if (token && user) {
      try {
        const data = {
          username: user,
          token: token
        }
        const response = await axiosInstance.post('/notification/report_token', data, {
          headers: {
            'Content-Type': 'application/json', // Ensure the request is in JSON format
          }
        });
      } catch (error) {
        console.error('Error saving notification token:', error);
      }
    }
  }

  /**
   *
   * @returns
   */
  const logout = async (remove_token: boolean): Promise<SignOutResponse> => {
    if (remove_token)
    {
      await removeNotificationToken();
    }
    await save("auth_token", null);
    await save("user", null);
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
      const response = await axios.post(BASE_URL + '/auth/sign-in', { username: username, password: password });
      if (response.status === 200) {
        await save("auth_token", response.data.auth_token.token);
        setAuth(username);
        await save("user", username);
        await saveNotificationToken();
        return { data: username, error: undefined };
      } else {
        await save("user", null);
        setAuth(null);
        return { error: "Something went wrong with request", data: undefined };
      }
    } catch (error: any) {
      await save("user", null);
      await save("auth_token", null);
      if (error.response && error.response.status === 401) {
        Alert.alert("Login Failed", "Invalid username or password");
        return { error: "Invalid username or password", data: undefined };
      } else {
        Alert.alert("Login Failed", " Something went wrong");
        return { error: "Something went wrong", data: undefined };
      }
    }
  };

  const createAcount = async (
    username: string,
    password: string,
    profile_picture: string,
  ): Promise<SignInResponse> => {
    try {
      const response = await axios.post(BASE_URL + '/auth/sign-up', {
        username: username,
        password: password,
        profile_picture: profile_picture
      });

      if (response.status === 201) {
        await save("auth_token", response.data.auth_token.token);
        setAuth(username);
        await save("user", username);
        await saveNotificationToken();
        return { data: username, error: undefined };
      } else {
        await save("user", null);
        Alert.alert("Sign Up Failed", "Something went wrong");
        return { error: "Something went wrong", data: undefined };
      }
    } catch (error: any) {
      await save("user", null);
      await save("auth_token", null);
      if (error.response && error.response.status === 409) {
        Alert.alert("Sign Up Failed", "Username already taken");
        return { error: "Username already taken", data: undefined };
      } else {
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
