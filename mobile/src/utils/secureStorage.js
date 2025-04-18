import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Define storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
};

/**
 * Store data securely - uses SecureStore on native platforms and AsyncStorage on web
 * @param {string} key - The storage key
 * @param {string} value - The value to store
 */
export const secureStore = async (key, value) => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
    return true;
  } catch (error) {
    console.error('Error storing data securely:', error);
    return false;
  }
};

/**
 * Retrieve data from secure storage
 * @param {string} key - The storage key
 * @returns {Promise<string|null>} The stored value or null
 */
export const secureRetrieve = async (key) => {
  try {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.error('Error retrieving data from secure storage:', error);
    return null;
  }
};

/**
 * Remove data from secure storage
 * @param {string} key - The storage key
 */
export const secureRemove = async (key) => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
    return true;
  } catch (error) {
    console.error('Error removing data from secure storage:', error);
    return false;
  }
};

/**
 * Store authentication token securely
 * @param {string} token - The auth token to store
 */
export const storeAuthToken = async (token) => {
  return await secureStore(STORAGE_KEYS.AUTH_TOKEN, token);
};

/**
 * Retrieve authentication token
 * @returns {Promise<string|null>} The auth token or null
 */
export const getAuthToken = async () => {
  return await secureRetrieve(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Remove authentication token
 */
export const removeAuthToken = async () => {
  return await secureRemove(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Store user data securely
 * @param {Object} userData - The user data to store
 */
export const storeUserData = async (userData) => {
  return await secureStore(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
};

/**
 * Retrieve user data
 * @returns {Promise<Object|null>} The user data or null
 */
export const getUserData = async () => {
  const data = await secureRetrieve(STORAGE_KEYS.USER_DATA);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

/**
 * Remove user data
 */
export const removeUserData = async () => {
  return await secureRemove(STORAGE_KEYS.USER_DATA);
}; 