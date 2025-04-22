import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './AuthContext';
import * as soundUtils from '../utils/soundUtils';

// Create context
const SoundContext = createContext(null);

// Hook to use the sound context
export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

// Sound Provider component
export const SoundProvider = ({ children }) => {
  const { user } = useAuth();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  
  // Initialize sounds
  useEffect(() => {
    const initSounds = async () => {
      try {
        // Load sounds
        await Promise.all([
          soundUtils.loadSound('move', require('../../assets/sounds/move.mp3')),
          soundUtils.loadSound('capture', require('../../assets/sounds/capture.mp3')),
          soundUtils.loadSound('check', require('../../assets/sounds/check.mp3')),
          soundUtils.loadSound('complete', require('../../assets/sounds/complete.mp3')),
          soundUtils.loadSound('error', require('../../assets/sounds/error.mp3')),
        ]);
        
        // Get sound preference from storage
        const enabled = await soundUtils.getSoundEnabled();
        setSoundEnabled(enabled);
        setSoundsLoaded(true);
      } catch (error) {
        console.error('Error initializing sounds:', error);
      }
    };
    
    initSounds();
    
    // Cleanup sounds on unmount
    return () => {
      soundUtils.unloadSounds();
    };
  }, []);
  
  // Sync user preferences with sound settings
  useEffect(() => {
    if (user?.preferences?.sound !== undefined) {
      setSoundEnabled(user.preferences.sound);
      soundUtils.setSoundEnabled(user.preferences.sound);
    }
  }, [user?.preferences?.sound]);
  
  // Toggle sound on/off
  const toggleSound = async (value) => {
    try {
      setSoundEnabled(value);
      await soundUtils.setSoundEnabled(value);
      return true;
    } catch (error) {
      console.error('Error toggling sound:', error);
      Alert.alert('Error', 'Failed to update sound preferences');
      return false;
    }
  };
  
  // Play a sound
  const playSound = (name) => {
    if (soundEnabled && soundsLoaded) {
      soundUtils.playSound(name);
    }
  };
  
  // Context value
  const value = {
    soundEnabled,
    toggleSound,
    playSound,
    soundsLoaded,
  };
  
  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
}; 