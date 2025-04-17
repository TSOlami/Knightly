import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { PUZZLE_CATEGORIES } from '../data/puzzleCategories';
import CategoryCard from '../components/CategoryCard';
import theme from '../theme';
import TabBarIcon from '../components/TabBarIcon';

const CategoriesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter categories based on search query
  const filteredCategories = PUZZLE_CATEGORIES.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const navigateToCategory = (category) => {
    navigation.navigate('PuzzleList', {
      categoryId: category.id,
      categoryName: category.name,
    });
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
        
        {filteredCategories.length === 0 ? (
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