import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { View, Text, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as WebBrowser from 'expo-web-browser';

// Ensure auth session can complete properly
WebBrowser.maybeCompleteAuthSession();

// Keep the splash screen visible while we check authentication
SplashScreen.preventAutoHideAsync();

// Root layout that wraps everything with AuthProvider
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}

// Content component that uses auth context
function RootLayoutContent() {
  const { loading, authenticated } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Hide splash screen once we've determined auth state
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    // Return a loading screen while checking auth status
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4361ee" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {authenticated ? (
        // Show app screens when authenticated
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="puzzle/[id]" options={{ presentation: 'card' }} />
        </>
      ) : (
        // Show auth screens when not authenticated
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}
