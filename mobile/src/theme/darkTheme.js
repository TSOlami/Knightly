const COLORS = {
  primary: '#3D97BC',         // Lighter Ocean Blue
  secondary: '#C54C92',       // Lighter Vibrant Purple
  tertiary: '#FFA022',        // Lighter Vibrant Orange
  background: '#121212',      // Dark Gray
  card: '#1E1E1E',
  text: {
    primary: '#FFFFFF',
    secondary: '#AAAAAA',
    light: '#FFFFFF',
    disabled: '#666666',
  },
  success: '#5DBF60',
  error: '#FF5252',
  warning: '#FFC107',
  info: '#42A5F5',
  greyLight: '#333333',
  greyDark: '#AAAAAA',
  skeleton: '#333333',        // Skeleton loading base color
  skeletonHighlight: '#444444', // Skeleton loading highlight color
  border: '#444444',
  pieces: {
    white: '#FFFFFF',
    black: '#333333',
  },
  board: {
    light: '#3A4252',
    dark: '#2A3142',
    highlight: 'rgba(255, 213, 79, 0.5)',
    selected: 'rgba(106, 192, 216, 0.8)',
    validMove: 'rgba(106, 192, 216, 0.5)',
    check: 'rgba(219, 80, 74, 0.7)',
  }
};

// Import other theme properties from light theme since they don't change
import lightTheme from './lightTheme';

export default {
  COLORS,
  TYPOGRAPHY: lightTheme.TYPOGRAPHY,
  SPACING: lightTheme.SPACING,
  SHADOWS: {
    ...lightTheme.SHADOWS,
    small: {
      ...lightTheme.SHADOWS.small,
      shadowOpacity: 0.3,
    },
    medium: {
      ...lightTheme.SHADOWS.medium,
      shadowOpacity: 0.4,
    },
    large: {
      ...lightTheme.SHADOWS.large,
      shadowOpacity: 0.5,
    },
  },
  BORDER_RADIUS: lightTheme.BORDER_RADIUS,
}; 