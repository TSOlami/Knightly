import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import theme from '../theme';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout, updatePreferences, loading } = useAuth();
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

  const goToSettings = () => {
    router.push('/settings');
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
        title="Go to Settings"
        onPress={goToSettings}
        style={styles.settingsButton}
        icon={<Ionicons name="settings-outline" size={20} color={theme.COLORS.white} />}
      />
      
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
    padding: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.COLORS.text.secondary,
    textAlign: 'center',
  },
  card: {
    margin: 16,
    marginTop: 0,
  },
  cardText: {
    fontSize: 14,
    color: theme.COLORS.text.secondary,
    marginBottom: 16,
  },
  createAccountButton: {
    backgroundColor: theme.COLORS.secondary,
  },
  settingsButton: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: theme.COLORS.secondary,
  },
  logoutButton: {
    margin: 16,
    marginTop: 8,
    backgroundColor: theme.COLORS.background,
    borderWidth: 1,
    borderColor: theme.COLORS.danger,
  },
  logoutButtonText: {
    color: theme.COLORS.danger,
  },
});

export default ProfileScreen; 