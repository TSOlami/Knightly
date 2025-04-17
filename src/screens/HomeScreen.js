import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { PUZZLE_CATEGORIES } from '../data/puzzleCategories';
import { getAllPuzzles, getPuzzlesByCategory } from '../data/puzzles';
import theme from '../theme';
import Card from '../components/Card';
import PuzzleCard from '../components/PuzzleCard';
import Button from '../components/Button';
import CategoryCard from '../components/CategoryCard';
import AnimatedBox from '../components/AnimatedBox';
import SimpleAnimation from '../components/SimpleAnimation';

const HomeScreen = ({ navigation }) => {
  const [featuredPuzzles, setFeaturedPuzzles] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  
  useEffect(() => {
    // Get some featured puzzles (one from each category)
    const featured = [];
    
    // Get first puzzle from each category
    PUZZLE_CATEGORIES.forEach(category => {
      const puzzlesInCategory = getPuzzlesByCategory(category.id);
      if (puzzlesInCategory.length > 0) {
        featured.push({
          ...puzzlesInCategory[0],
          categoryId: category.id,
          categoryName: category.name,
        });
      }
    });
    
    // Limit to 5 featured puzzles
    setFeaturedPuzzles(featured.slice(0, 5));
    
    // Set some popular categories (hard-coded for now, could be based on user stats)
    setPopularCategories(PUZZLE_CATEGORIES.slice(0, 3));
  }, []);
  
  const navigateToPuzzle = (puzzle) => {
    navigation.navigate('Puzzle', {
      puzzleId: puzzle.id,
      puzzleName: puzzle.name,
      puzzle: puzzle,
    });
  };
  
  const navigateToCategory = (category) => {
    navigation.navigate('PuzzleList', {
      categoryId: category.id,
      categoryName: category.name,
    });
  };
  
  const navigateToAllCategories = () => {
    navigation.navigate('CategoriesTab');
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero section */}
      <View style={styles.heroContainer}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Knightly</Text>
          <Text style={styles.heroSubtitle}>Master Chess Tactics</Text>
          <Button 
            title="Explore Puzzles" 
            onPress={navigateToAllCategories} 
            style={styles.heroButton}
          />
        </View>
      </View>
      
      {/* Featured puzzles section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Puzzles</Text>
          <TouchableOpacity onPress={navigateToAllCategories}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredPuzzlesContainer}
        >
          {featuredPuzzles.map(puzzle => (
            <View key={puzzle.id} style={styles.featuredPuzzleCard}>
              <PuzzleCard
                puzzle={puzzle}
                onPress={() => navigateToPuzzle(puzzle)}
              />
            </View>
          ))}
        </ScrollView>
      </View>
      
      {/* Popular categories section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Categories</Text>
          <TouchableOpacity onPress={navigateToAllCategories}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {popularCategories.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            onPress={() => navigateToCategory(category)}
          />
        ))}
      </View>
      
      {/* Simple Animation Test */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Simple Animation</Text>
        </View>
        <SimpleAnimation />
      </View>
      
      {/* Quick challenge section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Test Animations</Text>
          <Text style={styles.animationText}>Tap to animate</Text>
        </View>
        
        <View style={styles.animationContainer}>
          <AnimatedBox size={80} color={theme.COLORS.primary} />
          <AnimatedBox size={80} color={theme.COLORS.secondary} />
          <AnimatedBox size={80} color={theme.COLORS.error} />
        </View>
        
        <Card
          title="Daily Challenge"
          subtitle="Test your skills with a new puzzle every day"
          onPress={() => {
            // Randomly select a puzzle as daily challenge
            const allPuzzles = getAllPuzzles();
            const randomIndex = Math.floor(Math.random() * allPuzzles.length);
            navigateToPuzzle(allPuzzles[randomIndex]);
          }}
          style={styles.dailyChallengeCard}
          variant="elevated"
        >
          <Text style={styles.dailyChallengeText}>
            Solve today's puzzle to maintain your streak!
          </Text>
          <Button
            title="Start Challenge"
            variant="primary"
            size="small"
            style={styles.dailyChallengeButton}
          />
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
  },
  contentContainer: {
    paddingBottom: theme.SPACING.xl,
  },
  heroContainer: {
    height: 200,
    backgroundColor: theme.COLORS.primary,
    paddingHorizontal: theme.SPACING.lg,
    paddingVertical: theme.SPACING.xl,
    marginBottom: theme.SPACING.lg,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: theme.TYPOGRAPHY.fontSize.xxxl,
    fontWeight: 'bold',
    color: theme.COLORS.white,
    marginBottom: theme.SPACING.xs,
  },
  heroSubtitle: {
    fontSize: theme.TYPOGRAPHY.fontSize.lg,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: theme.SPACING.md,
  },
  heroButton: {
    alignSelf: 'flex-start',
  },
  section: {
    paddingHorizontal: theme.SPACING.md,
    marginBottom: theme.SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.SPACING.md,
  },
  sectionTitle: {
    fontSize: theme.TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: theme.COLORS.text.primary,
  },
  seeAllText: {
    fontSize: theme.TYPOGRAPHY.fontSize.sm,
    color: theme.COLORS.primary,
    fontWeight: '600',
  },
  featuredPuzzlesContainer: {
    paddingRight: theme.SPACING.md,
  },
  featuredPuzzleCard: {
    width: 280,
    marginRight: theme.SPACING.md,
  },
  dailyChallengeCard: {
    backgroundColor: theme.COLORS.secondary,
  },
  dailyChallengeText: {
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    color: theme.COLORS.white,
    marginBottom: theme.SPACING.md,
  },
  dailyChallengeButton: {
    alignSelf: 'flex-start',
  },
  animationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: theme.SPACING.lg,
    paddingVertical: theme.SPACING.md,
  },
  animationText: {
    fontSize: theme.TYPOGRAPHY.fontSize.sm,
    color: theme.COLORS.text.secondary,
    fontWeight: '600',
  },
});

export default HomeScreen; 