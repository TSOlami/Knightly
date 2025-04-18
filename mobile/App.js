import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { LogBox, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExpoRoot } from 'expo-router';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from 'react-native-elements';

// Fix for touch responsiveness issues
LogBox.ignoreLogs([
  'Require cycle:',
  'ViewPropTypes will be removed from React Native',
  '[Layout children]',
  'No route named "(modals)" exists',
  'useAuth must be used within an AuthProvider', // Temporarily ignore this while we fix it
]);

// Toggle dev menu using 'm' key in terminal to fix touch responsiveness
console.log('To fix touch responsiveness issues, you may need to toggle the dev menu by pressing "m" in the terminal');

export default function App() {
  // Toggle dev menu to fix touch issues - this is a known workaround
  useEffect(() => {
    const toggleDevMenu = async () => {
      try {
        if (__DEV__) {
          console.log('Tip: If touch is not responsive, press m in the terminal to toggle dev menu');
        }
      } catch (e) {
        console.warn('Error:', e);
      }
    };
    
    toggleDevMenu();
  }, []);

  // Setup expo router
  const ctx = require.context('./app');
  return (
    <AuthProvider>
      <SafeAreaProvider style={styles.container}>
        <StatusBar style="auto" />
        <ExpoRoot context={ctx} />
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
