import axios from 'axios';
import { getValueFor, save } from '../app/context/store';
import { BASE_URL } from '../app.config';

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
    if (error.response?.status === 401) {
      await save("user", null);
      await save("auth_token", null);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
