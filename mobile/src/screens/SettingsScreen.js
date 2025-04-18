import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import theme from '../theme';
import TabBarIcon from '../components/TabBarIcon';
import Card from '../components/Card';

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
  // Settings state
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    sounds: true,
    animations: true,
    moveHighlights: true,
  });
  
  // Update a single setting
  const updateSetting = (key, value) => {
    setSettings({
      ...settings,
      [key]: value,
    });
  };
  
  // Handle actions for buttons
  const handleAction = (action) => {
    switch (action) {
      case 'about':
        Alert.alert('About Knightly', 'Knightly is a chess puzzle app designed to help players improve their tactical skills. Version 1.0.0');
        break;
      case 'feedback':
        Alert.alert('Feedback', 'Thank you for using Knightly! Your feedback would normally be sent to our team.');
        break;
      case 'clear-data':
        Alert.alert(
          'Clear App Data',
          'Are you sure you want to clear all app data? This will reset your progress and settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Clear Data', 
              style: 'destructive',
              onPress: () => {
                // Would normally clear data from storage
                setSettings({
                  notifications: true,
                  darkMode: false,
                  sounds: true,
                  animations: true,
                  moveHighlights: true,
                });
                Alert.alert('Data Cleared', 'All app data has been reset.');
              }
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
          value={settings.darkMode}
          onValueChange={(value) => updateSetting('darkMode', value)}
        />
        
        <SettingItem
          icon="volume-2"
          title="Sound Effects"
          description="Play sounds for moves and actions"
          value={settings.sounds}
          onValueChange={(value) => updateSetting('sounds', value)}
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
          description="Version information and credits"
          type="button"
          onValueChange={() => handleAction('about')}
        />
        
        <SettingItem
          icon="message-circle"
          title="Send Feedback"
          description="Help us improve Knightly"
          type="button"
          onValueChange={() => handleAction('feedback')}
        />
        
        <SettingItem
          icon="trash-2"
          title="Clear App Data"
          description="Reset all progress and settings"
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