import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { COLORS, SHADOWS, SIZES } from '../theme';

// Import LinearGradient with a fallback mechanism
let LinearGradient;
try {
  LinearGradient = require('react-native-linear-gradient').LinearGradient;
} catch (e) {
  // If LinearGradient fails to load, create a fallback component
  LinearGradient = ({ colors, style, children, ...props }) => (
    <View style={[style, { backgroundColor: colors[0] }]} {...props}>
      {children}
    </View>
  );
}

const PuzzleCard = ({ puzzle, onPress, style }) => {
  // Generate difficulty stars using actual icons
  const renderDifficultyIcons = (level) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3].map((star) => (
          <Icon 
            key={star}
            name="star" 
            size={14} 
            color={star <= level ? COLORS.accent : 'rgba(255,255,255,0.3)'} 
            solid={star <= level}
            style={styles.starIcon}
          />
        ))}
      </View>
    );
  };

  // Extract puzzle type icon
  const getPuzzleIcon = () => {
    if (puzzle.solution && Array.isArray(puzzle.solution)) {
      return puzzle.solution.length > 2 ? "chess-rook" : "chess-knight";
    }
    return "chess-queen"; // Default for checkmate in one
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        borderRadius={16}
      >
        <View style={styles.header}>
          <Text style={styles.name}>{puzzle.name}</Text>
          {renderDifficultyIcons(puzzle.difficulty)}
        </View>
        
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Icon name={getPuzzleIcon()} size={24} color={COLORS.card} style={styles.icon} />
          </View>
          <Text style={styles.hint} numberOfLines={2}>
            {puzzle.hint}
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.solution}>{
            Array.isArray(puzzle.solution) 
              ? `${puzzle.solution.length} moves to solve` 
              : '1 move to solve'
          }</Text>
          <Icon name="arrow-right" size={12} color={COLORS.card} style={styles.arrowIcon} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: SIZES.m,
    ...SHADOWS.medium,
  },
  gradient: {
    padding: SIZES.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.s,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.card,
    flex: 1,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginLeft: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.s,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SIZES.s,
  },
  hint: {
    flex: 1,
    fontSize: 15,
    color: COLORS.card,
    opacity: 0.9,
  },
  footer: {
    marginTop: SIZES.s,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  solution: {
    fontSize: 12,
    color: COLORS.card,
    opacity: 0.8,
    marginRight: 4,
  },
  arrowIcon: {
    marginTop: 1,
  }
});

export default PuzzleCard;