import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import PuzzleCard from '../components/PuzzleCard';
import Button from '../components/Button';
import theme from '../theme';
import TabBarIcon from '../components/TabBarIcon';
import puzzleService from '../services/puzzleService';
import { PuzzleCardSkeleton } from '../components/Skeleton';

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
  const [loadingMore, setLoadingMore] = useState(false);
  
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
    if (!hasMore || loading || loadingMore) return;
    
    try {
      setLoadingMore(true);
      
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
      setLoadingMore(false);
    }
  };
  
  // Apply filters
  const getFilteredPuzzles = () => {
    let filtered = [...puzzles];
    
    // Apply filter
    // In a real app, we should be checking the user's solved puzzles from AuthContext
    // This needs to be implemented by checking against the user's solvedPuzzles array
    if (filterIndex === 1) {
      // Unsolved puzzles - to be implemented with real user data
      filtered = filtered;
    } else if (filterIndex === 2) {
      // Solved puzzles - to be implemented with real user data
      filtered = filtered;
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
  const renderPuzzleItem = ({ item }) => {
    // This should check if the puzzle is in the user's solvedPuzzles array
    // For now, we'll set all puzzles as not completed until we implement the real check
    const completed = false;
    
    return (
      <PuzzleCard
        puzzle={item}
        onPress={() => navigateToPuzzle(item)}
        completed={completed}
      />
    );
  };
  
  // Calculate completion rate - this should be based on real data
  const completionRate = 0; // Will be updated when we implement the real check
  
  // Render a list of skeleton loading items
  const renderSkeletonLoading = () => {
    return Array(8).fill(0).map((_, index) => (
      <PuzzleCardSkeleton key={`skeleton-${index}`} />
    ));
  };

  // Render the footer for load more
  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.listFooter}>
        <PuzzleCardSkeleton />
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
          data={loading ? [] : getFilteredPuzzles()}
          renderItem={renderPuzzleItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={loadingMore ? renderFooter : null}
          onEndReached={loadMorePuzzles}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          ListEmptyComponent={loading ? (
            <View style={styles.skeletonContainer}>
              {renderSkeletonLoading()}
            </View>
          ) : null}
        />
      )}
      
      {/* Loading skeleton state */}
      {loading && (
        <View style={styles.skeletonOverlay}>
          <View style={styles.skeletonContainer}>
            {renderSkeletonLoading()}
          </View>
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
  listFooter: {
    paddingVertical: theme.SPACING.md,
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
  skeletonContainer: {
    padding: theme.SPACING.md,
  },
  skeletonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.COLORS.background,
    paddingTop: 200, // Start below the header, filters, etc.
  }
});

export default PuzzleListScreen; 