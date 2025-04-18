import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import LoginScreen from '../../src/screens/LoginScreen';
import { router } from 'expo-router';

export default function Login() {
  const { login, loginAsGuest, loginWithGoogle, loading, error } = useAuth();
  const [localError, setLocalError] = useState(null);

  const handleLogin = async (email, password) => {
    try {
      setLocalError(null);
      await login(email, password);
      // Successfully logged in, redirect to main app
      router.replace('/');
    } catch (err) {
      setLocalError(err.message || 'Login failed');
      Alert.alert('Login Error', err.message || 'Failed to login');
    }
  };

  const handleGuestLogin = async () => {
    try {
      setLocalError(null);
      await loginAsGuest();
      // Successfully logged in as guest, redirect to main app
      router.replace('/');
    } catch (err) {
      setLocalError(err.message || 'Guest login failed');
      Alert.alert('Login Error', err.message || 'Failed to login as guest');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLocalError(null);
      await loginWithGoogle();
      // Successfully logged in with Google, redirect to main app
      router.replace('/');
    } catch (err) {
      setLocalError(err.message || 'Google login failed');
      Alert.alert('Login Error', err.message || 'Failed to login with Google');
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4361ee" />
          <Text style={styles.loadingText}>Logging in...</Text>
        </View>
      ) : (
        <LoginScreen 
          onLogin={handleLogin}
          onGuestLogin={handleGuestLogin}
          onGoogleLogin={handleGoogleLogin}
          loading={loading}
          error={localError || error}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  }
}); 