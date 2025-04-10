import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
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

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.43;

const CategoryCard = ({ category, onPress }) => {
  // Helper to get gradient colors based on category
  const getGradientColors = () => {
    const baseColor = category.color || COLORS.primary;
    return [
      baseColor,
      adjustColor(baseColor, -20) // Slightly darker shade
    ];
  };

  // Utility to darken/lighten a color
  const adjustColor = (hex, amount) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        borderRadius={18}
      >
        <View style={styles.iconContainer}>
          <Icon name={category.icon} size={28} color="#fff" solid />
        </View>
        
        <Text style={styles.title}>{category.name}</Text>
        
        <Text style={styles.description} numberOfLines={2}>
          {category.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {category.id ? (category.id.includes('checkmate') ? 
                `${category.movesToSolve} move${category.movesToSolve > 1 ? 's' : ''}` : 
                'Tactics') : ''}
            </Text>
          </View>
          <Icon name="chevron-right" size={14} color="#fff" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: 18,
    marginHorizontal: SIZES.xs,
    marginBottom: SIZES.m,
    ...SHADOWS.medium
  },
  gradient: {
    padding: SIZES.m,
    height: 170,
    borderRadius: 18,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.s,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: SIZES.xs,
  },
  description: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: SIZES.s,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countBadge: {
    paddingHorizontal: SIZES.s,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  }
});

export default CategoryCard;