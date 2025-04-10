// Theme configuration for the Knightly chess app
// Centralized styling to maintain consistency

export const COLORS = {
  // Primary colors
  primary: '#4a6ea9',
  primaryDark: '#2c4975',
  primaryLight: '#7190c9',
  
  // Secondary colors
  secondary: '#e76f51',
  secondaryDark: '#c54f31',
  secondaryLight: '#f59a81',
  
  // Accent color
  accent: '#ffb703',
  
  // UI colors
  background: '#f5f8ff',
  card: '#ffffff',
  text: '#2d3748',
  textLight: '#718096',
  border: '#e2e8f0',
  error: '#e53e3e',
  success: '#38a169',

  // Chess piece colors
  whitePiece: '#ffffff',
  blackPiece: '#2c3e50',

  // Chessboard colors
  whiteSquare: '#f0d9b5',
  blackSquare: '#b58863',
  selectedSquare: 'rgba(130, 202, 252, 0.8)',
  validMove: 'rgba(73, 186, 66, 0.8)',
  lastMove: 'rgba(247, 199, 126, 0.5)',
};

export const SIZES = {
  // Basic spacing
  xs: 8,
  s: 12,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
  
  // Font sizes
  h1: 32,
  h2: 24,
  h3: 20,
  body: 16,
  caption: 14,
  small: 12,
  
  // Border radius
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  
  // Icon sizes
  iconSm: 16,
  iconMd: 24,
  iconLg: 32,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const FONTS = {
  regular: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
  semiBold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
};

export default {
  COLORS,
  SIZES,
  SHADOWS,
  FONTS,
};