import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sound storage key
const SOUND_ENABLED_KEY = 'sound_enabled';

// Sound objects cache
let sounds = {};

/**
 * Initialize a sound file
 * @param {string} name - The name to reference the sound by
 * @param {any} resource - The require() resource for the sound file
 */
export const loadSound = async (name, resource) => {
  try {
    const { sound } = await Audio.Sound.createAsync(resource);
    sounds[name] = sound;
    return sound;
  } catch (error) {
    console.error('Error loading sound:', error);
    return null;
  }
};

/**
 * Play a sound if sounds are enabled
 * @param {string} name - The name of the sound to play
 */
export const playSound = async (name) => {
  try {
    // Check if sounds are enabled
    const soundEnabledString = await AsyncStorage.getItem(SOUND_ENABLED_KEY);
    const soundEnabled = soundEnabledString === null ? true : JSON.parse(soundEnabledString);
    
    if (!soundEnabled || !sounds[name]) return;
    
    // Replay the sound (need to rewind first)
    await sounds[name].setPositionAsync(0);
    await sounds[name].playAsync();
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

/**
 * Set whether sounds are enabled
 * @param {boolean} enabled - Whether sounds should be enabled
 */
export const setSoundEnabled = async (enabled) => {
  try {
    await AsyncStorage.setItem(SOUND_ENABLED_KEY, JSON.stringify(enabled));
  } catch (error) {
    console.error('Error saving sound preference:', error);
  }
};

/**
 * Get whether sounds are enabled
 * @returns {Promise<boolean>} - Whether sounds are enabled
 */
export const getSoundEnabled = async () => {
  try {
    const value = await AsyncStorage.getItem(SOUND_ENABLED_KEY);
    return value === null ? true : JSON.parse(value);
  } catch (error) {
    console.error('Error getting sound preference:', error);
    return true;
  }
};

/**
 * Unload all sounds to free up resources
 */
export const unloadSounds = async () => {
  try {
    const soundNames = Object.keys(sounds);
    for (const name of soundNames) {
      if (sounds[name]) {
        await sounds[name].unloadAsync();
      }
    }
    sounds = {};
  } catch (error) {
    console.error('Error unloading sounds:', error);
  }
}; 