import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Switch, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import theme from '../theme';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout, updatePreferences, loading } = useAuth();
  const [isSoundEnabled, setIsSoundEnabled] = useState(
    user?.preferences?.sound ?? true
  );
  const [isHapticEnabled, setIsHapticEnabled] = useState(
    user?.preferences?.hapticFeedback ?? true
  );
  const [selectedTheme, setSelectedTheme] = useState(
    user?.preferences?.theme ?? 'system'
  );
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert('Logout Failed', error.message);
    }
  };
  
  const savePreferences = async () => {
    try {
      await updatePreferences({
        theme: selectedTheme,
        sound: isSoundEnabled,
        hapticFeedback: isHapticEnabled,
      });
      Alert.alert('Success', 'Preferences saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save preferences');
    }
  };
  
  const handleConvertAccount = () => {
    if (user?.isGuest) {
      router.push('/settings/convert-account');
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>{user.username.charAt(0).toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.username}>{user.username}</Text>
        {user.isGuest ? (
          <View style={styles.guestBadge}>
            <Text style={styles.guestBadgeText}>Guest Account</Text>
          </View>
        ) : (
          <Text style={styles.memberSince}>Member since {new Date(user.createdAt).toLocaleDateString()}</Text>
        )}
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{user.puzzlesSolved || 0}</Text>
          <Text style={styles.statLabel}>Puzzles Solved</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{user.streak || 0}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{user.puzzleRating || 1200}</Text>
          <Text style={styles.statLabel}>Puzzle Rating</Text>
        </View>
      </View>
      
      <Card title="Settings" style={styles.settingsCard}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Sound Effects</Text>
          <Switch
            value={isSoundEnabled}
            onValueChange={setIsSoundEnabled}
            trackColor={{ false: theme.COLORS.greyLight, true: theme.COLORS.primary }}
            thumbColor={theme.COLORS.white}
          />
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Haptic Feedback</Text>
          <Switch
            value={isHapticEnabled}
            onValueChange={setIsHapticEnabled}
            trackColor={{ false: theme.COLORS.greyLight, true: theme.COLORS.primary }}
            thumbColor={theme.COLORS.white}
          />
        </View>
        
        <View style={styles.themeSelector}>
          <Text style={styles.settingLabel}>App Theme</Text>
          <View style={styles.themeOptions}>
            <Button
              title="Light"
              style={[
                styles.themeButton,
                selectedTheme === 'light' && styles.selectedThemeButton,
              ]}
              textStyle={[
                styles.themeButtonText,
                selectedTheme === 'light' && styles.selectedThemeButtonText,
              ]}
              onPress={() => setSelectedTheme('light')}
              icon={<Ionicons name="sunny" size={16} color={selectedTheme === 'light' ? theme.COLORS.white : theme.COLORS.greyDark} />}
            />
            <Button
              title="Dark"
              style={[
                styles.themeButton,
                selectedTheme === 'dark' && styles.selectedThemeButton,
              ]}
              textStyle={[
                styles.themeButtonText,
                selectedTheme === 'dark' && styles.selectedThemeButtonText,
              ]}
              onPress={() => setSelectedTheme('dark')}
              icon={<Ionicons name="moon" size={16} color={selectedTheme === 'dark' ? theme.COLORS.white : theme.COLORS.greyDark} />}
            />
            <Button
              title="System"
              style={[
                styles.themeButton,
                selectedTheme === 'system' && styles.selectedThemeButton,
              ]}
              textStyle={[
                styles.themeButtonText,
                selectedTheme === 'system' && styles.selectedThemeButtonText,
              ]}
              onPress={() => setSelectedTheme('system')}
              icon={<Ionicons name="settings" size={16} color={selectedTheme === 'system' ? theme.COLORS.white : theme.COLORS.greyDark} />}
            />
          </View>
        </View>
        
        <Button
          title="Save Preferences"
          onPress={savePreferences}
          style={styles.saveButton}
          disabled={loading}
        />
      </Card>
      
      {user.isGuest && (
        <Card title="Convert Guest Account" style={styles.card}>
          <Text style={styles.cardText}>
            Create a permanent account to save your progress and stats.
          </Text>
          <Button
            title="Create Account"
            onPress={handleConvertAccount}
            style={styles.createAccountButton}
          />
        </Card>
      )}
      
      <Button
        title="Logout"
        onPress={handleLogout}
        style={styles.logoutButton}
        textStyle={styles.logoutButtonText}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: theme.COLORS.primary,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 40,
    color: theme.COLORS.white,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.COLORS.white,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: theme.COLORS.lightText,
  },
  guestBadge: {
    backgroundColor: theme.COLORS.warning,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  guestBadgeText: {
    color: theme.COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: theme.COLORS.white,
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.COLORS.greyDark,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  settingsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardText: {
    fontSize: 14,
    color: theme.COLORS.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.greyLight,
  },
  settingLabel: {
    fontSize: 16,
    color: theme.COLORS.text,
  },
  themeSelector: {
    paddingVertical: 12,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  themeButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: theme.COLORS.white,
    borderWidth: 1,
    borderColor: theme.COLORS.greyLight,
  },
  selectedThemeButton: {
    backgroundColor: theme.COLORS.primary,
    borderColor: theme.COLORS.primary,
  },
  themeButtonText: {
    color: theme.COLORS.greyDark,
    fontSize: 12,
  },
  selectedThemeButtonText: {
    color: theme.COLORS.white,
  },
  saveButton: {
    marginTop: 16,
  },
  createAccountButton: {
    marginTop: 8,
  },
  logoutButton: {
    margin: 16,
    marginTop: 8,
    backgroundColor: theme.COLORS.white,
    borderWidth: 1,
    borderColor: theme.COLORS.error,
  },
  logoutButtonText: {
    color: theme.COLORS.error,
  },
});

export default ProfileScreen; 