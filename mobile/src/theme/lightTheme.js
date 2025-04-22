const COLORS = {
  primary: '#2E86AB',         // Ocean Blue
  secondary: '#A23B72',       // Vibrant Purple
  tertiary: '#F18F01',        // Vibrant Orange
  background: '#F5F7FA',      // Light Gray
  card: '#FFFFFF',
  text: {
    primary: '#2D2D34',
    secondary: '#6B7280',
    light: '#FFFFFF',
    disabled: '#CCCCCC',
  },
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  greyLight: '#EEEEEE',
  greyDark: '#666666',
  skeleton: '#E1E9EE',        // Skeleton loading base color
  skeletonHighlight: '#F2F8FC', // Skeleton loading highlight color
  border: '#DEDEDE',
  pieces: {
    white: '#F8F8F8',
    black: '#383838',
  },
  board: {
    light: '#E8EDF9',
    dark: '#B7C0D8',
    highlight: 'rgba(255, 213, 79, 0.5)',
    selected: 'rgba(106, 192, 216, 0.8)',
    validMove: 'rgba(106, 192, 216, 0.5)',
    check: 'rgba(219, 80, 74, 0.5)',
  }
};

const TYPOGRAPHY = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    xs: 18,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 44,
  },
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  circle: 9999,
};

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  SHADOWS,
  BORDER_RADIUS,
}; 