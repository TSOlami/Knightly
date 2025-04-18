import { Stack, useLocalSearchParams } from 'expo-router';
import theme from '../../src/theme';

// Helper function to set screen options based on route
const getScreenOptions = (route) => {
  if (route.name === 'puzzle') {
    return {
      title: route.params?.puzzleName || 'Chess Puzzle',
    };
  }
  
  if (route.name === 'puzzle-list') {
    return {
      title: route.params?.categoryName || 'Puzzles',
    };
  }
  
  return {
    title: 'Knightly',
  };
};

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: theme.COLORS.primary,
        },
        headerTintColor: theme.COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        presentation: 'modal',
        ...getScreenOptions(route),
      })}
    />
  );
} 