import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import PuzzleCard from '../components/PuzzleCard';
import Button from '../components/Button';
import theme from '../theme';
import TabBarIcon from '../components/TabBarIcon';
import puzzleService from '../services/puzzleService';

const PuzzleListScreen = ({ categoryName: propCategoryName, categoryId: propCategoryId }) => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Use props if provided, otherwise use URL params
  const categoryId = propCategoryId || params.categoryId;
  const categoryName = propCategoryName || params.categoryName;
  
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterIndex, setFilterIndex] = useState(0);
  const [sortIndex, setSortIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Filter options
  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Unsolved', value: 'unsolved' },
    { label: 'Solved', value: 'solved' },
  ];
  
  // Sort options
  const sortOptions = [
    { label: 'Default', value: 'default' },
    { label: 'Rating ↑', value: 'rating' },
    { label: 'Rating ↓', value: '-rating' },
    { label: 'Popularity', value: 'popularity' },
  ];
  
  // Fetch puzzles for the category
  useEffect(() => {
    const fetchPuzzles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Reset pagination when filters change
        setPage(1);
        setPuzzles([]);
        
        // Get the sort order from the selected sort option
        const ordering = sortOptions[sortIndex].value;
        
        // Get puzzles from API
        const response = await puzzleService.getPuzzles(1, 20, {
          theme: categoryId,
          ordering: ordering
        });
        
        // Format the puzzles for display
        const formattedPuzzles = response.puzzles.map(puzzle => 
          puzzleService.formatPuzzle(puzzle)
        );
        
        setPuzzles(formattedPuzzles);
        setHasMore(response.page < response.total_pages);
      } catch (err) {
        console.error('Failed to fetch puzzles:', err);
        setError('Failed to load puzzles. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (categoryId) {
      fetchPuzzles();
    }
  }, [categoryId, sortIndex]);
  
  // Load more puzzles when scrolling
  const loadMorePuzzles = async () => {
    if (!hasMore || loading) return;
    
    try {
      setLoading(true);
      
      const nextPage = page + 1;
      const ordering = sortOptions[sortIndex].value;
      
      // Get the next page of puzzles
      const response = await puzzleService.getPuzzles(nextPage, 20, {
        theme: categoryId,
        ordering: ordering
      });
      
      const formattedPuzzles = response.puzzles.map(puzzle => 
        puzzleService.formatPuzzle(puzzle)
      );
      
      // Append new puzzles to the existing list
      setPuzzles(prevPuzzles => [...prevPuzzles, ...formattedPuzzles]);
      setPage(nextPage);
      setHasMore(nextPage < response.total_pages);
    } catch (err) {
      console.error('Failed to load more puzzles:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Apply filters
  const getFilteredPuzzles = () => {
    let filtered = [...puzzles];
    
    // Apply filter
    // Note: In a real app, you would get the solved status from user data in the API
    // This is a mock implementation just for the UI
    if (filterIndex === 1) {
      // Unsolved only - for this mock, assume odd-indexed puzzles are unsolved
      filtered = filtered.filter((_, index) => index % 2 === 1);
    } else if (filterIndex === 2) {
      // Solved only - for this mock, assume even-indexed puzzles are solved
      filtered = filtered.filter((_, index) => index % 2 === 0);
    }
    
    return filtered;
  };
  
  // Navigate to a puzzle
  const navigateToPuzzle = (puzzle) => {
    router.push({
      pathname: '/(modals)/puzzle',
      params: {
        puzzleId: puzzle.id,
        puzzleName: puzzle.name
      }
    });
  };
  
  // Render an item in the list
  const renderPuzzleItem = ({ item, index }) => {
    // Mock completed status
    const completed = index % 2 === 0;
    
    return (
      <PuzzleCard
        puzzle={item}
        onPress={() => navigateToPuzzle(item)}
        completed={completed}
      />
    );
  };
  
  // Calculate completion rate - mock data
  const completionRate = puzzles.length > 0
    ? Math.round((puzzles.length / 2) / puzzles.length * 100)  // Mock: half of puzzles are completed
    : 0;
  
  // Render footer for the list (loading indicator)
  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <View style={styles.listFooter}>
        <ActivityIndicator size="small" color={theme.COLORS.primary} />
        <Text style={styles.loadingMoreText}>Loading more puzzles...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with category info */}
      <View style={styles.header}>
        <Text style={styles.categoryName}>{categoryName}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{puzzles.length}</Text>
            <Text style={styles.statLabel}>Puzzles</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completionRate}%</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </View>
      
      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        {filterOptions.map((option, index) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.filterButton,
              filterIndex === index && styles.activeFilterButton
            ]}
            onPress={() => setFilterIndex(index)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterIndex === index && styles.activeFilterText
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Sort dropdown */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.sortButtonsContainer}>
          {sortOptions.map((option, index) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.sortButton,
                sortIndex === index && styles.activeSortButton
              ]}
              onPress={() => setSortIndex(index)}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortIndex === index && styles.activeSortText
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Puzzles list */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : puzzles.length === 0 && !loading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No puzzles found in this category</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredPuzzles()}
          renderItem={renderPuzzleItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
          onEndReached={loadMorePuzzles}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
        />
      )}
      
      {/* Loading indicator */}
      {loading && puzzles.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.COLORS.primary} />
          <Text style={styles.loadingText}>Loading puzzles...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
  },
  header: {
    backgroundColor: theme.COLORS.white,
    padding: theme.SPACING.md,
    ...theme.SHADOWS.small,
  },
  categoryName: {
    fontSize: theme.TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    color: theme.COLORS.text.primary,
    marginBottom: theme.SPACING.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: theme.SPACING.sm,
  },
  statItem: {
    marginRight: theme.SPACING.lg,
  },
  statValue: {
    fontSize: theme.TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: theme.COLORS.primary,
  },
  statLabel: {
    fontSize: theme.TYPOGRAPHY.fontSize.xs,
    color: theme.COLORS.text.secondary,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: theme.COLORS.white,
    paddingHorizontal: theme.SPACING.sm,
    ...theme.SHADOWS.small,
  },
  filterButton: {
    paddingVertical: theme.SPACING.sm,
    paddingHorizontal: theme.SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeFilterButton: {
    borderBottomColor: theme.COLORS.primary,
  },
  filterButtonText: {
    fontSize: theme.TYPOGRAPHY.fontSize.sm,
    color: theme.COLORS.text.secondary,
  },
  activeFilterText: {
    color: theme.COLORS.primary,
    fontWeight: 'bold',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.SPACING.sm,
    backgroundColor: theme.COLORS.background,
  },
  sortLabel: {
    fontSize: theme.TYPOGRAPHY.fontSize.sm,
    color: theme.COLORS.text.secondary,
    marginRight: theme.SPACING.sm,
  },
  sortButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sortButton: {
    paddingVertical: theme.SPACING.xs,
    paddingHorizontal: theme.SPACING.sm,
    borderRadius: theme.BORDER_RADIUS.sm,
    backgroundColor: theme.COLORS.background,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    marginRight: theme.SPACING.xs,
    marginBottom: theme.SPACING.xs,
  },
  activeSortButton: {
    backgroundColor: theme.COLORS.primary,
    borderColor: theme.COLORS.primary,
  },
  sortButtonText: {
    fontSize: theme.TYPOGRAPHY.fontSize.xs,
    color: theme.COLORS.text.secondary,
  },
  activeSortText: {
    color: theme.COLORS.white,
  },
  listContent: {
    padding: theme.SPACING.md,
    paddingBottom: theme.SPACING.xxl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.SPACING.xl,
  },
  emptyStateText: {
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    color: theme.COLORS.text.secondary,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  loadingText: {
    marginTop: theme.SPACING.md,
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    color: theme.COLORS.text.secondary,
  },
  listFooter: {
    paddingVertical: theme.SPACING.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingMoreText: {
    marginLeft: theme.SPACING.sm,
    fontSize: theme.TYPOGRAPHY.fontSize.sm,
    color: theme.COLORS.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.SPACING.xl,
  },
  errorText: {
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    color: theme.COLORS.error,
    textAlign: 'center',
  },
});

export default PuzzleListScreen; 