import { Stack } from 'expo-router';
import { SoundProvider } from '../../src/context/SoundContext';

export default function AuthLayout() {
  return (
    <SoundProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ title: 'Sign In' }} />
        <Stack.Screen name="register" options={{ title: 'Create Account' }} />
      </Stack>
    </SoundProvider>
  );
} 