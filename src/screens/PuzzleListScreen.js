import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getPuzzlesByCategory } from '../data/puzzles';
import PuzzleCard from '../components/PuzzleCard';
import Button from '../components/Button';
import theme from '../theme';
import TabBarIcon from '../components/TabBarIcon';

const PuzzleListScreen = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  const [puzzles, setPuzzles] = useState([]);
  const [filterIndex, setFilterIndex] = useState(0);
  const [sortIndex, setSortIndex] = useState(0);
  
  // Filter options
  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Unsolved', value: 'unsolved' },
    { label: 'Solved', value: 'solved' },
  ];
  
  // Sort options
  const sortOptions = [
    { label: 'Default', value: 'default' },
    { label: 'Moves ↑', value: 'moves-asc' },
    { label: 'Moves ↓', value: 'moves-desc' },
  ];
  
  useEffect(() => {
    // Load puzzles for this category
    const categoryPuzzles = getPuzzlesByCategory(categoryId);
    
    // Add completed status (would normally come from user data)
    const puzzlesWithStatus = categoryPuzzles.map((puzzle, index) => ({
      ...puzzle,
      completed: index % 3 === 0, // Mock data - every 3rd puzzle is completed
    }));
    
    setPuzzles(puzzlesWithStatus);
  }, [categoryId]);
  
  // Apply filters and sorting
  const getFilteredAndSortedPuzzles = () => {
    let filtered = [...puzzles];
    
    // Apply filter
    if (filterIndex === 1) {
      // Unsolved only
      filtered = filtered.filter(puzzle => !puzzle.completed);
    } else if (filterIndex === 2) {
      // Solved only
      filtered = filtered.filter(puzzle => puzzle.completed);
    }
    
    // Apply sorting
    if (sortIndex === 1) {
      // Moves ascending
      filtered.sort((a, b) => a.solution.length - b.solution.length);
    } else if (sortIndex === 2) {
      // Moves descending
      filtered.sort((a, b) => b.solution.length - a.solution.length);
    }
    
    return filtered;
  };
  
  // Navigate to a puzzle
  const navigateToPuzzle = (puzzle) => {
    navigation.navigate('Puzzle', {
      puzzleId: puzzle.id,
      puzzleName: puzzle.name,
      puzzle: puzzle,
    });
  };
  
  // Render an item in the list
  const renderPuzzleItem = ({ item }) => (
    <PuzzleCard
      puzzle={item}
      onPress={() => navigateToPuzzle(item)}
      completed={item.completed}
    />
  );
  
  // Calculate completion rate
  const completionRate = puzzles.length > 0
    ? Math.round((puzzles.filter(p => p.completed).length / puzzles.length) * 100)
    : 0;

  return (
    <View style={styles.container}>
      {/* Stats bar */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{puzzles.length}</Text>
          <Text style={styles.statLabel}>Puzzles</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {puzzles.filter(p => p.completed).length}
          </Text>
          <Text style={styles.statLabel}>Solved</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completionRate}%</Text>
          <Text style={styles.statLabel}>Complete</Text>
        </View>
      </View>
      
      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Filter:</Text>
          <View style={styles.filterOptions}>
            {filterOptions.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.filterOption,
                  filterIndex === index && styles.filterOptionActive,
                ]}
                onPress={() => setFilterIndex(index)}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    filterIndex === index && styles.filterOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Sort:</Text>
          <View style={styles.filterOptions}>
            {sortOptions.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.filterOption,
                  sortIndex === index && styles.filterOptionActive,
                ]}
                onPress={() => setSortIndex(index)}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    sortIndex === index && styles.filterOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      
      {/* Puzzles list */}
      <FlatList
        data={getFilteredAndSortedPuzzles()}
        renderItem={renderPuzzleItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No puzzles found</Text>
          </View>
        }
      />
      
      {/* Random puzzle button */}
      <View style={styles.randomButtonContainer}>
        <Button
          title="Random Puzzle"
          onPress={() => {
            const filteredPuzzles = getFilteredAndSortedPuzzles();
            if (filteredPuzzles.length > 0) {
              const randomIndex = Math.floor(Math.random() * filteredPuzzles.length);
              navigateToPuzzle(filteredPuzzles[randomIndex]);
            }
          }}
          disabled={getFilteredAndSortedPuzzles().length === 0}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.COLORS.white,
    paddingVertical: theme.SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    ...theme.SHADOWS.small,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    color: theme.COLORS.primary,
  },
  statLabel: {
    fontSize: theme.TYPOGRAPHY.fontSize.sm,
    color: theme.COLORS.text.secondary,
  },
  filtersContainer: {
    padding: theme.SPACING.md,
    backgroundColor: theme.COLORS.white,
    marginBottom: theme.SPACING.sm,
    ...theme.SHADOWS.small,
  },
  filterGroup: {
    marginBottom: theme.SPACING.sm,
  },
  filterLabel: {
    fontSize: theme.TYPOGRAPHY.fontSize.sm,
    fontWeight: 'bold',
    color: theme.COLORS.text.secondary,
    marginBottom: theme.SPACING.xs,
  },
  filterOptions: {
    flexDirection: 'row',
  },
  filterOption: {
    paddingHorizontal: theme.SPACING.md,
    paddingVertical: theme.SPACING.xs,
    borderRadius: theme.BORDER_RADIUS.sm,
    marginRight: theme.SPACING.sm,
    backgroundColor: theme.COLORS.background,
  },
  filterOptionActive: {
    backgroundColor: theme.COLORS.primary,
  },
  filterOptionText: {
    fontSize: theme.TYPOGRAPHY.fontSize.sm,
    color: theme.COLORS.text.secondary,
  },
  filterOptionTextActive: {
    color: theme.COLORS.white,
    fontWeight: 'bold',
  },
  listContent: {
    padding: theme.SPACING.md,
    paddingBottom: 80, // Extra space for the random button
  },
  emptyContainer: {
    padding: theme.SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    color: theme.COLORS.text.secondary,
  },
  randomButtonContainer: {
    position: 'absolute',
    bottom: theme.SPACING.md,
    left: theme.SPACING.md,
    right: theme.SPACING.md,
    alignItems: 'center',
  },
});

export default PuzzleListScreen; 