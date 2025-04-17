import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import theme from '../theme';
import { getDifficultyLabel } from '../data/puzzleCategories';

const CategoryCard = ({ category, onPress }) => {
  const { name, description, difficulty, backgroundColor, icon } = category;
  
  // SVG paths for chess piece icons
  const iconPaths = {
    pawn: "M12 2C11.5 2 11 2.19 10.59 2.59C10.2 3 10 3.5 10 4C10 4.16 10.06 4.39 10.13 4.62C8.43 5.32 7.23 6.78 7.04 8.5C5.87 9 5 10.17 5 11.5C5 12.5 5.5 13.52 6.22 14.22C4.97 14.75 4 15.96 4 17.5C4 19.43 5.57 21 7.5 21H16.5C18.43 21 20 19.43 20 17.5C20 15.96 19.03 14.76 17.78 14.23C18.5 13.5 19 12.5 19 11.5C19 10.17 18.13 9 16.96 8.5C16.77 6.78 15.57 5.32 13.87 4.62C13.94 4.39 14 4.16 14 4C14 3.5 13.8 3 13.41 2.59C13 2.19 12.5 2 12 2Z",
    knight: "M19 22H5V20H19V22M13 2V2.26C12.74 2.09 12.39 2 12 2C11.72 2 11.46 2.05 11.21 2.14C11.08 2.19 10.95 2.26 10.84 2.34C10.58 2.5 10.36 2.74 10.21 3L8.97 5.31L7.31 8L7 9.38C6.04 10.18 5.5 11.39 5.5 12.75C5.5 13.5 5.75 14.19 6.14 14.77L3 19.5V20H13L16.5 15.5L16.5 15.5C16.5 15.36 16.57 15.22 16.7 15.15C16.78 15.1 16.85 15.06 16.94 15.03C17.28 14.92 17.67 15.14 17.66 15.5C17.66 15.5 17.65 15.64 17.64 15.67L16 19L14.42 20H19V19.5L15.5 14.5C15.5 14.5 15.49 14.38 15.5 14.35C15.83 14.07 16.11 13.73 16.31 13.35L16.31 13.34C16.35 13.27 16.4 13.21 16.44 13.14C16.97 12.21 17.15 11.08 16.92 10C16.64 8.77 15.86 7.66 14.75 6.93L14.22 6.59L13 10.5L9.34 9.25L9.39 9.25C10.73 8.86 11.47 7.62 11.53 6.59L11.37 6.57C11.5 5.85 11.2 5.09 10.61 4.69L10.22 4.45C10.25 4.19 10.4 4 10.59 3.87C10.87 3.66 11.15 3.63 11.37 3.63C11.59 3.62 11.81 3.62 12 3.63C12.2 3.64 12.42 3.68 12.61 3.69C12.79 3.71 12.94 3.72 13.07 3.69C13.2 3.66 13.33 3.56 13.41 3.41C13.5 3.26 13.94 2 13.94 2H13Z",
    bishop: "M19 22H5V20H19V22M17.16 8.26C18.22 9.63 18.86 11.28 19 13C19 15.76 15.87 18 12 18S5 15.76 5 13C5.14 11.28 5.78 9.63 6.84 8.26C6.17 7.05 6.07 5.64 6.13 4.76C6.44 4.97 6.73 5.21 7 5.47C8.42 4.44 10.17 3.8 12 3.8C13.83 3.8 15.58 4.44 17 5.47C17.27 5.21 17.57 4.97 17.87 4.76C17.93 5.64 17.83 7.05 17.16 8.26Z",
    rook: "M5 20H19V22H5V20M17 2V5H15V2H13V5H11V2H9V5H7V2H5V8.5C5 10.13 6.17 11.42 7.33 12.19V13H16.67V12.19C17.83 11.42 19 10.13 19 8.5V2H17Z",
    queen: "M18 3L21 0V3L18 6L15 3V0L18 3M11 3L14 0V3L11 6L8 3V0L11 3M4 3L7 0V3L4 6L1 3V0L4 3M18 21H6V9H18V21M18 7H6V8H18V7Z",
    king: "M19 22H5V20H19V22M17 17L12 22L7 17H2L12 7L22 17H17Z",
    chess: "M2 2V22H22V2H2M20 12H16V16H20V20H4V16H8V12H4V4H20V12M14 5H6V11H14V5Z",
  };

  const iconPath = iconPaths[icon] || iconPaths.chess;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Svg
          width={40}
          height={40}
          viewBox="0 0 24 24"
          fill={theme.COLORS.white}
        >
          <Path d={iconPath} />
        </Svg>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
        <View style={styles.difficultyContainer}>
          <Text style={styles.difficultyText}>
            Difficulty: {getDifficultyLabel(difficulty)}
          </Text>
          <View style={styles.difficultyIndicator}>
            {Array(5).fill(0).map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.difficultyDot, 
                  index < difficulty && styles.activeDot
                ]} 
              />
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: theme.BORDER_RADIUS.lg,
    marginVertical: theme.SPACING.sm,
    overflow: 'hidden',
    ...theme.SHADOWS.medium,
  },
  iconContainer: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.SPACING.md,
  },
  contentContainer: {
    flex: 1,
    padding: theme.SPACING.md,
    backgroundColor: theme.COLORS.white,
    borderTopRightRadius: theme.BORDER_RADIUS.lg,
    borderBottomRightRadius: theme.BORDER_RADIUS.lg,
  },
  title: {
    fontSize: theme.TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: theme.COLORS.text.primary,
    marginBottom: theme.SPACING.xs,
  },
  description: {
    fontSize: theme.TYPOGRAPHY.fontSize.sm,
    color: theme.COLORS.text.secondary,
    marginBottom: theme.SPACING.md,
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  difficultyText: {
    fontSize: theme.TYPOGRAPHY.fontSize.xs,
    color: theme.COLORS.text.secondary,
    fontWeight: '500',
  },
  difficultyIndicator: {
    flexDirection: 'row',
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.COLORS.background,
    marginLeft: 4,
  },
  activeDot: {
    backgroundColor: theme.COLORS.tertiary,
  },
});

export default CategoryCard; 