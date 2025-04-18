import axios from 'axios';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import { getAuthToken } from '../utils/secureStorage';
import { Platform } from 'react-native';

// API base URL - use environment variable or fallback
// For Android emulator, localhost needs to be 10.0.2.2
// For physical devices, we need to use the computer's actual IP address
let API_URL = process.env.EXPO_PUBLIC_API_URL;
if (!API_URL) {
  if (Platform.OS === 'android' && !__DEV__) {
    // Use actual IP address when running on physical devices
    // This will need to be updated with your computer's IP address
    API_URL = 'http://your-computer-ip:5000/api';
  } else if (Platform.OS === 'android') {
    API_URL = 'http://10.0.2.2:5000/api';
  } else {
    API_URL = 'http://localhost:5000/api';
  }
}

console.log('Using API URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// For handling API errors consistently
const handleApiError = (error) => {
  console.error('API Error:', error);
  
  // Network errors
  if (error.message === 'Network Error') {
    console.error('Network error - unable to connect to server');
    return Promise.reject(new Error('Unable to connect to server. Please check your internet connection and try again.'));
  }
  
  // Axios timeout
  if (error.code === 'ECONNABORTED') {
    console.error('Timeout error - server took too long to respond');
    return Promise.reject(new Error('Server took too long to respond. Please try again later.'));
  }
  
  // Server errors or other API errors
  const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
  console.error('API Error details:', errorMessage);
  return Promise.reject(new Error(errorMessage));
};

// Auth service functions
const authService = {
  // Register new user
  register: async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
      });
      
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Login with email and password
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Login as guest
  loginAsGuest: async () => {
    try {
      console.log('Attempting to connect to backend for guest login...');
      const response = await api.post('/auth/guest');
      console.log('Guest login success from server');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Google OAuth login
  loginWithGoogle: async () => {
    try {
      // Get redirect URI from environment
      const redirectUri = AuthSession.makeRedirectUri({
        useProxy: true,
        scheme: Constants.expoConfig?.scheme,
      });
      
      // Create auth request
      const authUrl = `${API_URL}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
      
      // Start auth flow
      const result = await AuthSession.startAsync({
        authUrl,
      });
      
      // Check if auth was successful
      if (result.type === 'success' && result.params.token) {
        // Get user data
        const userData = await authService.getCurrentUser(result.params.token);
        
        return { ...userData, token: result.params.token };
      } else {
        throw new Error('Google authentication failed');
      }
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Logout
  logout: async () => {
    try {
      // We can optionally call server logout endpoint if needed
      return true;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get current user data
  getCurrentUser: async (token) => {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await api.get('/users/me', config);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Convert guest account to regular account
  convertGuestAccount: async (username, email, password) => {
    try {
      const response = await api.post('/users/convert-guest', {
        username,
        email,
        password,
      });
      
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Update user preferences
  updatePreferences: async (preferences) => {
    try {
      const response = await api.patch('/users/preferences', {
        preferences,
      });
      
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default authService; 