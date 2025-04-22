import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExpoRoot } from 'expo-router';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { SoundProvider } from './src/context/SoundContext';
import * as Notifications from 'expo-notifications';
import { useRef, useEffect } from 'react';
import { router } from 'expo-router';

// Set up notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Set up notification listeners
    notificationListener.current = Notifications.addNotificationReceivedListener(
      notification => {
        console.log('Notification received:', notification);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log('Notification response received:', response);
        const screen = response.notification.request.content.data?.screen;
        if (screen) {
          router.push(screen);
        }
      }
    );

    // Clean up listeners on unmount
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <SoundProvider>
            <StatusBar style="auto" />
            <ExpoRoot context={require.context('./app', true)} />
          </SoundProvider>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
