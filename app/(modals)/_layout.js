import { Stack } from 'expo-router';
import theme from '../../src/theme';

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.COLORS.primary,
        },
        headerTintColor: theme.COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        presentation: 'modal',
      }}
    />
  );
} 