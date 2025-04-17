import { Stack, Redirect } from 'expo-router';
import { useColorScheme } from 'react-native';
import theme from '../src/theme';
import { Slot } from 'expo-router';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return <Slot />;
}
