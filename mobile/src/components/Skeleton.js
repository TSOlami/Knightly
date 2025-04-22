import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import defaultTheme from '../theme'; // Import default theme as fallback

const Skeleton = ({ width, height, borderRadius = 4, style }) => {
  // Use try-catch to handle case when ThemeProvider is not available
  let theme;
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
  } catch (error) {
    // Fallback to default theme if ThemeProvider is not available
    theme = defaultTheme;
  }

  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [opacity]);

  // Use skeleton colors from theme or fallback
  const baseColor = theme?.COLORS?.skeleton || '#E1E9EE';

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: baseColor,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const PuzzleCardSkeleton = () => {
  // Use try-catch to handle case when ThemeProvider is not available
  let theme;
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
  } catch (error) {
    // Fallback to default theme if ThemeProvider is not available
    theme = defaultTheme;
  }
  
  const cardBgColor = theme?.COLORS?.card || '#FFFFFF';
  
  return (
    <View style={[styles.cardContainer, { backgroundColor: cardBgColor }]}>
      <View style={styles.leftContainer}>
        <Skeleton 
          width={8} 
          height={40} 
          borderRadius={0} 
        />
      </View>
      
      <View style={styles.contentContainer}>
        <Skeleton 
          width={'70%'} 
          height={18} 
          style={styles.title} 
        />
        <Skeleton 
          width={'50%'} 
          height={16} 
          style={styles.subtitle} 
        />
      </View>
      
      <View style={styles.infoContainer}>
        <Skeleton 
          width={30} 
          height={30} 
          borderRadius={15}
        />
      </View>
    </View>
  );
};

export const CategoryCardSkeleton = () => {
  // Use try-catch to handle case when ThemeProvider is not available
  let theme;
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
  } catch (error) {
    // Fallback to default theme if ThemeProvider is not available
    theme = defaultTheme;
  }
  
  const cardBgColor = theme?.COLORS?.card || '#FFFFFF';
  
  return (
    <View style={[styles.categoryCard, { backgroundColor: cardBgColor }]}>
      <Skeleton 
        width={'100%'} 
        height={120} 
        borderRadius={8}
      />
      <Skeleton 
        width={'60%'} 
        height={20} 
        style={styles.categoryTitle}
        borderRadius={4} 
      />
      <Skeleton 
        width={'80%'} 
        height={16} 
        style={styles.categorySubtitle}
        borderRadius={4} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 72,
  },
  leftContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 6,
  },
  subtitle: {
    marginBottom: 2,
  },
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  categoryCard: {
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 0,
  },
  categoryTitle: {
    marginTop: 12,
    marginHorizontal: 12,
  },
  categorySubtitle: {
    marginTop: 6,
    marginBottom: 12,
    marginHorizontal: 12,
  }
});

export default Skeleton; 