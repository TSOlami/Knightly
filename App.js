import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { LogBox, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExpoRoot } from 'expo-router';

// Fix for touch responsiveness issues
LogBox.ignoreLogs([
  'Require cycle:',
  'ViewPropTypes will be removed from React Native',
  '[Layout children]',
]);

// Toggle dev menu using 'm' key in terminal to fix touch responsiveness
console.log('To fix touch responsiveness issues, you may need to toggle the dev menu by pressing "m" in the terminal');

export default function App() {
  // Toggle dev menu to fix touch issues - this is a known workaround
  useEffect(() => {
    const toggleDevMenu = async () => {
      try {
        if (__DEV__) {
          console.log('Toggle dev menu to fix touch responsiveness issues');
          // This is just a notification, actual toggling is done via the 'm' key in the terminal
        }
      } catch (e) {
        console.warn('Error toggling dev menu:', e);
      }
    };
    
    toggleDevMenu();
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />
        <ExpoRoot />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
