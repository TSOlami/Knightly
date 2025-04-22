import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import CategoryCard from '../components/CategoryCard';
import theme from '../theme';
import TabBarIcon from '../components/TabBarIcon';
import puzzleService from '../services/puzzleService';
import { CategoryCardSkeleton } from '../components/Skeleton';

const CategoriesScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get themes from the API
        const themes = await puzzleService.getThemes();
        
        // Transform API data to match our category format
        const themeCategories = themes.map(theme => ({
          id: theme.id,
          name: theme.name,
          description: `${theme.count} puzzles with the ${theme.name} theme`,
          difficulty: Math.min(Math.ceil(Math.random() * 4), 4), // Random difficulty between 1-4 for now
          icon: getIconForTheme(theme.name),
          backgroundColor: getColorForTheme(theme.name),
          count: theme.count
        }));
        
        setCategories(themeCategories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Helper function to assign an icon based on theme name
  const getIconForTheme = (themeName) => {
    const themeToIconMap = {
      'mate': 'king',
      'mateIn': 'king',
      'sacrifice': 'queen',
      'fork': 'knight',
      'pin': 'bishop',
      'hanging': 'rook',
      'skewer': 'bishop',
      'endgame': 'pawn',
      'opening': 'pawn',
      'middlegame': 'queen',
      'tactical': 'knight',
      'defensiveTactical': 'rook',
      'advantage': 'queen'
    };
    
    // Try to match theme name to a chess piece
    for (const key in themeToIconMap) {
      if (themeName.toLowerCase().includes(key.toLowerCase())) {
        return themeToIconMap[key];
      }
    }
    
    // Default icon if no match
    return 'chess';
  };
  
  // Helper function to assign a color based on theme name
  const getColorForTheme = (themeName) => {
    const colors = [
      '#2E86AB', '#A23B72', '#F18F01', '#4CAF50', 
      '#9C27B0', '#FF5722', '#607D8B', '#3F51B5',
      '#009688', '#795548', '#E91E63'
    ];
    
    // Use a hash function to consistently assign the same color to the same theme
    const hash = themeName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  
  // Filter categories based on search query
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const navigateToCategory = (category) => {
    router.push({
      pathname: '/(modals)/puzzle-list',
      params: {
        categoryId: category.id,
        categoryName: category.name
      }
    });
  };

  // Render skeleton loading placeholders
  const renderSkeletonLoading = () => {
    return Array(6).fill(0).map((_, index) => (
      <CategoryCardSkeleton key={`skeleton-${index}`} />
    ));
  };

  return (
    <View style={styles.container}>
      {/* Search input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchIconContainer}>
          <TabBarIcon name="search" color={theme.COLORS.text.secondary} size={20} />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.COLORS.text.secondary}
        />
        {searchQuery.length > 0 && (
          <View style={styles.clearIconContainer}>
            <TabBarIcon
              name="x-circle"
              color={theme.COLORS.text.secondary}
              size={20}
              onPress={() => setSearchQuery('')}
            />
          </View>
        )}
      </View>
      
      {/* Categories list */}
      <ScrollView 
        style={styles.categoriesList}
        contentContainerStyle={styles.categoriesContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>All Categories</Text>
        
        {loading ? (
          <View>
            {renderSkeletonLoading()}
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : filteredCategories.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No categories found</Text>
          </View>
        ) : (
          filteredCategories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onPress={() => navigateToCategory(category)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.md,
    marginHorizontal: theme.SPACING.md,
    marginTop: theme.SPACING.md,
    paddingHorizontal: theme.SPACING.sm,
    ...theme.SHADOWS.small,
  },
  searchIconContainer: {
    padding: theme.SPACING.sm,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    color: theme.COLORS.text.primary,
  },
  clearIconContainer: {
    padding: theme.SPACING.sm,
  },
  categoriesList: {
    flex: 1,
  },
  categoriesContent: {
    padding: theme.SPACING.md,
    paddingBottom: theme.SPACING.xl,
  },
  sectionTitle: {
    fontSize: theme.TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: theme.COLORS.text.primary,
    marginBottom: theme.SPACING.md,
  },
  errorContainer: {
    padding: theme.SPACING.xl,
    alignItems: 'center',
  },
  errorText: {
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    color: theme.COLORS.error,
    textAlign: 'center',
  },
  emptyState: {
    padding: theme.SPACING.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    color: theme.COLORS.text.secondary,
  },
});

export default CategoriesScreen;