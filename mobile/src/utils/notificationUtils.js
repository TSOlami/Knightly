import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key for notification permission
const NOTIFICATION_ENABLED_KEY = 'notifications_enabled';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Request notification permissions
 * @returns {Promise<boolean>} Whether permission was granted
 */
export const requestNotificationPermissions = async () => {
  if (Platform.OS === 'web') {
    return false; // Web doesn't support notifications in the same way
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Only ask if permissions have not already been determined
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Save the status to AsyncStorage
    await AsyncStorage.setItem(NOTIFICATION_ENABLED_KEY, JSON.stringify(finalStatus === 'granted'));

    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Check if notifications are enabled
 * @returns {Promise<boolean>} Whether notifications are enabled
 */
export const areNotificationsEnabled = async () => {
  try {
    const storedValue = await AsyncStorage.getItem(NOTIFICATION_ENABLED_KEY);
    
    // If no stored value, check current permission
    if (storedValue === null) {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    }
    
    return JSON.parse(storedValue);
  } catch (error) {
    console.error('Error checking if notifications are enabled:', error);
    return false;
  }
};

/**
 * Set whether notifications are enabled
 * @param {boolean} enabled - Whether notifications should be enabled
 */
export const setNotificationsEnabled = async (enabled) => {
  try {
    if (enabled) {
      // Request permissions if enabling
      await requestNotificationPermissions();
    } else {
      // Just save the preference if disabling
      await AsyncStorage.setItem(NOTIFICATION_ENABLED_KEY, JSON.stringify(false));
    }
  } catch (error) {
    console.error('Error setting notifications enabled:', error);
  }
};

/**
 * Schedule a daily puzzle notification
 */
export const scheduleDailyPuzzleNotification = async () => {
  try {
    // Check if notifications are enabled
    const enabled = await areNotificationsEnabled();
    if (!enabled) {
      return false;
    }

    // Cancel any existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Set notification time to 9:00 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    // Schedule the notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Chess Puzzle",
        body: "Your daily puzzle is ready! Train your chess skills now.",
        data: { screen: '/(tabs)' },
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });

    return true;
  } catch (error) {
    console.error('Error scheduling daily puzzle notification:', error);
    return false;
  }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return true;
  } catch (error) {
    console.error('Error canceling notifications:', error);
    return false;
  }
}; 