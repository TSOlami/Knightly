import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import theme from '../theme';
import TabBarIcon from '../components/TabBarIcon';
import Card from '../components/Card';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as notificationUtils from '../utils/notificationUtils';

const SettingItem = ({ icon, title, description, value, onValueChange, type = 'switch' }) => {
  return (
    <View style={styles.settingItem}>
      <View style={styles.settingIconContainer}>
        <TabBarIcon name={icon} color={theme.COLORS.primary} size={24} />
      </View>
      
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      
      <View style={styles.settingControl}>
        {type === 'switch' && (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#e0e0e0', true: theme.COLORS.primary }}
            thumbColor={value ? theme.COLORS.white : '#f4f3f4'}
          />
        )}
        
        {type === 'button' && (
          <TouchableOpacity 
            style={styles.settingButton}
            onPress={onValueChange}
          >
            <TabBarIcon name="chevron-right" color={theme.COLORS.text.secondary} size={20} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const SettingsScreen = () => {
  const { themeMode, changeTheme } = useTheme();
  const { user, updatePreferences } = useAuth();
  const { soundEnabled, toggleSound } = useSound();
  
  // Check if dark mode is enabled
  const isDarkMode = themeMode === 'dark';
  
  // Settings state with actual values from user preferences
  const [settings, setSettings] = useState({
    notifications: user?.preferences?.notifications ?? true,
    animations: user?.preferences?.animations ?? true,
    moveHighlights: user?.preferences?.moveHighlights ?? true,
  });
  
  // Initialize settings from user preferences when user data changes
  useEffect(() => {
    if (user?.preferences) {
      setSettings({
        notifications: user.preferences.notifications ?? true,
        animations: user.preferences.animations ?? true,
        moveHighlights: user.preferences.moveHighlights ?? true,
      });
    }
    
    // Also check notification permission status
    const checkNotificationStatus = async () => {
      const enabled = await notificationUtils.areNotificationsEnabled();
      setSettings(prev => ({
        ...prev,
        notifications: enabled
      }));
    };
    
    checkNotificationStatus();
  }, [user?.preferences]);
  
  // Update a setting
  const updateSetting = async (key, value) => {
    try {
      // Update local state immediately for responsiveness
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
      
      // Handle notification setting specially
      if (key === 'notifications') {
        await notificationUtils.setNotificationsEnabled(value);
        if (value) {
          await notificationUtils.scheduleDailyPuzzleNotification();
        } else {
          await notificationUtils.cancelAllNotifications();
        }
      }
      
      // Only update preferences if user exists
      if (user?.id) {
        const updatedPreferences = {
          ...user?.preferences,
          [key]: value
        };
        
        await updatePreferences(updatedPreferences);
      }
    } catch (error) {
      // Revert the setting if the update fails
      setSettings(prev => ({
        ...prev,
        [key]: !value
      }));
      console.error('Failed to update setting:', error);
      Alert.alert('Error', 'Failed to update setting. Please try again.');
    }
  };
  
  // Update theme setting
  const toggleDarkMode = async (value) => {
    try {
      const newThemeMode = value ? 'dark' : 'light';
      changeTheme(newThemeMode);
      
      // Only update preferences if user exists
      if (user?.id) {
        const updatedPreferences = {
          ...user?.preferences,
          theme: newThemeMode
        };
        
        await updatePreferences(updatedPreferences);
      }
    } catch (error) {
      console.error('Failed to update theme:', error);
      Alert.alert('Error', 'Failed to update theme. Please try again.');
    }
  };
  
  // Update sound setting
  const handleToggleSound = async (value) => {
    try {
      // Update sound context state and storage
      await toggleSound(value);
      
      // Also update user preferences in backend if user exists
      if (user?.id) {
        const updatedPreferences = {
          ...user?.preferences,
          sound: value
        };
        
        await updatePreferences(updatedPreferences);
      }
    } catch (error) {
      console.error('Failed to update sound setting:', error);
      Alert.alert('Error', 'Failed to update sound setting. Please try again.');
    }
  };
  
  // Clear app data
  const clearAppData = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.clear();
      
      // Show success message
      Alert.alert(
        'Data Cleared',
        'All app data has been reset. The app will now restart.',
        [
          { 
            text: 'OK',
            onPress: () => {
              // Force reload app
              router.replace('/(auth)/login');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Failed to clear app data:', error);
      Alert.alert('Error', 'Failed to clear app data. Please try again.');
    }
  };
  
  // Handle actions for buttons
  const handleAction = (action) => {
    switch (action) {
      case 'about':
        Alert.alert(
          'About Knightly',
          'Knightly is a chess puzzle app designed to help players improve their tactical skills through daily puzzles and challenges. Our puzzles are sourced from real games and categorized by themes and difficulty levels.\n\nVersion: 1.0.0\nDeveloped by: The Knightly Team',
          [{ text: 'OK' }]
        );
        break;
        
      case 'feedback':
        Alert.alert(
          'Send Feedback',
          'We appreciate your feedback! Please let us know how we can improve your experience with Knightly.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Send Email',
              onPress: () => {
                Alert.alert('Thank You', 'Your feedback would normally open an email form. This is a demo version.');
              }
            },
            {
              text: 'Report Bug',
              onPress: () => {
                Alert.alert('Thank You', 'Your bug report would normally open a form. This is a demo version.');
              }
            }
          ]
        );
        break;
        
      case 'clear-data':
        Alert.alert(
          'Clear App Data',
          'Are you sure you want to clear all app data? This will reset your progress, settings, and log you out. This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Clear Data', 
              style: 'destructive',
              onPress: clearAppData
            },
          ]
        );
        break;
        
      default:
        break;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card title="App Preferences" style={styles.settingsCard}>
        <SettingItem
          icon="bell"
          title="Notifications"
          description="Receive puzzle of the day reminders"
          value={settings.notifications}
          onValueChange={(value) => updateSetting('notifications', value)}
        />
        
        <SettingItem
          icon="moon"
          title="Dark Mode"
          description="Use dark theme throughout the app"
          value={isDarkMode}
          onValueChange={toggleDarkMode}
        />
        
        <SettingItem
          icon="volume-2"
          title="Sound Effects"
          description="Play sounds for moves and actions"
          value={soundEnabled}
          onValueChange={handleToggleSound}
        />
      </Card>
      
      <Card title="Game Settings" style={styles.settingsCard}>
        <SettingItem
          icon="zap"
          title="Animations"
          description="Show piece movement animations"
          value={settings.animations}
          onValueChange={(value) => updateSetting('animations', value)}
        />
        
        <SettingItem
          icon="check-circle"
          title="Move Highlights"
          description="Highlight valid moves on the board"
          value={settings.moveHighlights}
          onValueChange={(value) => updateSetting('moveHighlights', value)}
        />
      </Card>
      
      <Card title="About & Support" style={styles.settingsCard}>
        <SettingItem
          icon="info"
          title="About Knightly"
          description="Version, credits and information"
          type="button"
          onValueChange={() => handleAction('about')}
        />
        
        <SettingItem
          icon="message-circle"
          title="Feedback"
          description="Send feedback or report issues"
          type="button"
          onValueChange={() => handleAction('feedback')}
        />
        
        <SettingItem
          icon="trash-2"
          title="Clear App Data"
          description="Reset all settings and progress"
          type="button"
          onValueChange={() => handleAction('clear-data')}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
    padding: theme.SPACING.md,
  },
  settingsCard: {
    marginBottom: theme.SPACING.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  settingIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: theme.SPACING.sm,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: theme.COLORS.text.primary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: theme.TYPOGRAPHY.fontSize.sm,
    color: theme.COLORS.text.secondary,
  },
  settingControl: {
    marginLeft: theme.SPACING.sm,
  },
  settingButton: {
    padding: theme.SPACING.xs,
  },
});

export default SettingsScreen; 