import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

// Enable screens for better navigation performance
enableScreens();

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4a6ea9',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Chess Puzzles' 
          }} 
        />
        <Stack.Screen 
          name="puzzle/[id]" 
          options={({ route }) => ({ 
            title: `Puzzle ${route.params?.id || ''}` 
          })} 
        />
      </Stack>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
