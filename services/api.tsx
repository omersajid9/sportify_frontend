import axios from 'axios';
import { getValueFor, save } from '../app/context/store';
import { BASE_URL } from '../app.config';
import { router } from 'expo-router';
import eventEmitter from './eventEmitter';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const store_auth_token = await getValueFor("auth_token");
      if (store_auth_token) {
        config.headers.Authorization = `Bearer ${store_auth_token}`;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(error.response.status)
    console.log(error.response.statusText)
    if (error.response?.status === 401) {
      eventEmitter.emit('refresh-token');
      const originalRequest = error.config;
      return axiosInstance(originalRequest);
    }
    console.log("HEHERE")
  }
);

export default axiosInstance;
