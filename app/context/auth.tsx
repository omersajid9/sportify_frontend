import axios from "axios";
import { router, useRouter, useSegments } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { BASE_URL } from "../../app.config";
import { getValueFor, save } from "./store";
import Location, { getCurrentPositionAsync, getLastKnownPositionAsync, requestForegroundPermissionsAsync } from "expo-location";
import axiosInstance from "../../services/api";
import eventEmitter from "../../services/eventEmitter";

interface SignInResponse {
  data?: string;
  error?: Error | string;
}


interface OptSMSResponse {

}

export interface User {
  id: string,
  username: string,
  first_name?: string,
  last_name?: string,
  password?: string,
  auth_type: string,
  auth_id: string,
  profile_picture: string
}

interface EditProfile {
  user_id: string,
  first_name?: string,
  last_name?: string,
  password?: string,
  username?: string,
  profile_page?: string
}

interface LogInResponse {
  data?: User;
  error?: Error | string;
}

interface SignOutResponse {
  error: any | undefined;
  data: {} | undefined;
}

interface AuthContextValue {
  sendOptSMS: (phone: String) => Promise<OptSMSResponse>,
  logIn: (auth_type: String, auth_id: String, passcode?: String) => Promise<LogInResponse>,
  editProfile: (data: EditProfile) => Promise<any>,
  // signIn: (e: string, p: string) => Promise<SignInResponse>;
  // signUp: (username: string, password: string, profile_picture: string) => Promise<SignInResponse>;
  signOut: (remove_token: boolean) => Promise<SignOutResponse>;
  user: User | null;
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
  const [user, setAuth] = React.useState<User | null>(null);
  const [authInitialized, setAuthInitialized] = React.useState<boolean>(false);
  const [location, setLocation] = React.useState<Location | null>(null);

  const useProtectedRoute = (user: User | null) => {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
      const reStoreUser = async () => {
        const store_user = await getValueFor("user");
        if (user && store_user.id != user.id) {
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

      const handleRefershToken = async () => {
        // console.log("YAYYY")
        await refreshToken(); // Call logout when the event is emitted
      };
      const handleLogout = async () => {
        // console.log("YAYYY")
        await logout(true); // Call logout when the event is emitted
      };
      // router.replace('/onboarding');

  
      eventEmitter.on('log-out', handleLogout);
      eventEmitter.on('refresh-token', handleRefershToken);
      return () => {
        eventEmitter.off('refresh-token', handleRefershToken);
      };

      // if (
      //   !user &&
      //   !inAuthGroup
      // ) {
      //   router.navigate('/sign-in');
      // } else if (user && inAuthGroup) {
      // }
      // router.navigate("/");
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
          user_id: user.id,
          token: token
        }
        const response = await axiosInstance.post('/notification/remove_token', data, {
          headers: {
            'Content-Type': 'application/json', // Ensure the request is in JSON format
          }
        });
      } catch (error) {
        console.error('Error removing notification token:', error);
      }
    }
  }

  async function saveNotificationToken() {
    const token = await getValueFor("notification_token");
    const user = await getValueFor("user");
    if (token && user) {
      try {
        const data = {
          user_id: user.id,
          token: token
        }
        const response = await axiosInstance.post('/notification/report_token', data, {
          headers: {
            'Content-Type': 'application/json', // Ensure the request is in JSON format
          }
        });
        if (response.status == 200) {
          console.log("SUCCESS")
        }
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
    if (remove_token) {
      await removeNotificationToken();
    }
    await save("auth_token", null);
    await save("user", null);
    setAuth(null);
    return { error: undefined, data: "done" }
  };

  const sendoptsms = async (
    phone: String
  ): Promise<OptSMSResponse> => {
    try {
      const response = await axios.post(BASE_URL + '/auth/send-opt-sms', { phone: phone });
    } catch (e) {

    }

    return {}
  }

  const refreshToken = async (
  ): Promise<any> => {
    if (user) {
      try {
        const response = await axios.post(BASE_URL + '/auth/refresh-token', { user_id: user.id });
        if (response.status === 200) {
          await save("auth_token", response.data.auth_token.token);
        } else {
          await logout(true);
        }
      } catch (error: any) {
        await logout(true);
      }      
    }
  }
  const login = async (
    auth_type: String, auth_id: String, passcode?: String
  ): Promise<LogInResponse> => {
    try {
      const response = await axios.post(BASE_URL + '/auth/log-in', { auth_type: auth_type.toLowerCase(), auth_id: auth_id, passcode: passcode });
      if (response.status === 200) {
        const user = response.data.profile.user;
        console.log("User", user)
        await save("auth_token", response.data.auth_token.token);
        setAuth(user);
        await save("user", user);
        await saveNotificationToken();
        return { data: user, error: undefined };
      } else {
        await save("user", null);
        setAuth(null);
        return { error: "Something went wrong with request", data: undefined };
      }
    } catch (error: any) {
      console.log(error)
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
  }


  const editProfile = async (
    data: EditProfile
  ): Promise<any> => {
    try {
      const response = await axiosInstance.patch('/player/edit', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(response.status)
      if (response.status == 200) {
        const user = response.data.user;
        setAuth(user);
        await save("user", user);
      } else {

      }
      // await signOut(false);
    } catch (error: any) {
      console.log(error)
      Alert.alert("Edit profile failed");
    }

  }



  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        editProfile: editProfile,
        sendOptSMS: sendoptsms,
        logIn: login,
        signOut: logout,
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
