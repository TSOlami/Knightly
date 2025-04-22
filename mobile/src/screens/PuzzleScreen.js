import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ChessboardControl from '../components/ChessboardControl';
import Button from '../components/Button';
import Card from '../components/Card';
import theme from '../theme';
import TabBarIcon from '../components/TabBarIcon';
import puzzleService from '../services/puzzleService';

const { width } = Dimensions.get('window');
const boardSize = Math.min(width - 32, 400);

const PuzzleScreen = ({ puzzleName: propPuzzleName, puzzleId: propPuzzleId }) => {
  // Ensure router is properly initialized
  let router;
  try {
    router = useRouter();
  } catch (error) {
    console.error('Error initializing router:', error);
    // Provide fallback for navigation functions
    router = {
      back: () => console.warn('Router not available, could not navigate back'),
      setParams: () => console.warn('Router not available, could not set params'),
      replace: () => console.warn('Router not available, could not navigate')
    };
  }
  
  const params = useLocalSearchParams();
  
  // Use props if provided, otherwise use URL params
  const puzzleId = propPuzzleId || params?.puzzleId;
  const puzzleName = propPuzzleName || params?.puzzleName;
  
  const [puzzle, setPuzzle] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch puzzle from API
  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        if (puzzleId) {
          setLoading(true);
          const puzzleData = await puzzleService.getPuzzleById(puzzleId);
          // Format puzzle to match the app's expected format
          const formattedPuzzle = puzzleService.formatPuzzle(puzzleData);
          setPuzzle(formattedPuzzle);
        }
      } catch (error) {
        console.error('Failed to fetch puzzle:', error);
        Alert.alert('Error', 'Failed to load puzzle. Please try again.');
        try {
          router.back();
        } catch (navError) {
          console.error('Failed to navigate back:', navError);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchPuzzle();
  }, [puzzleId, router]);
  
  // Handle loading next puzzle
  const loadNextPuzzle = async () => {
    try {
      setIsLoading(true);
      const nextPuzzleData = await puzzleService.getNextPuzzle(puzzleId);
      
      if (nextPuzzleData) {
        const formattedPuzzle = puzzleService.formatPuzzle(nextPuzzleData);
        
        // Reset state for new puzzle
        setIsSolved(false);
        setShowSolution(false);
        setMoveHistory([]);
        setPuzzle(formattedPuzzle);
        setStartTime(Date.now());
        
        // Update the URL params
        router.replace({
          pathname: '/(modals)/puzzle',
          params: {
            puzzleName: formattedPuzzle.name,
            puzzleId: formattedPuzzle.id,
          }
        });
      } else {
        // No more puzzles or error
        Alert.alert(
          'No More Puzzles',
          'You have completed all available puzzles in this set!',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch (error) {
      console.error('Failed to load next puzzle:', error);
      Alert.alert('Error', 'Failed to load next puzzle. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle puzzle solved
  const handleSolve = async (moves) => {
    setIsSolved(true);
    setMoveHistory(moves);
    
    try {
      const timeToSolve = Date.now() - startTime;
      await puzzleService.markAsSolved(puzzleId, moves.length, timeToSolve);
      await loadNextPuzzle();
    } catch (error) {
      console.error('Error handling puzzle completion:', error);
      Alert.alert('Error', 'Failed to save progress. Please try again.');
    }
  };
  
  // If puzzle not loaded yet, show loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading puzzle...</Text>
      </View>
    );
  }
  
  if (!puzzle) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Puzzle not found</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Puzzle info card */}
      <Card style={styles.puzzleInfoCard}>
        <Text style={styles.puzzleName}>{puzzle.name}</Text>
        
        <View style={styles.puzzleMetaRow}>
          <View style={styles.metaItem}>
            <TabBarIcon name="chess" color={theme.COLORS.text.secondary} size={16} />
            <Text style={styles.metaText}>
              {puzzle.solution.length === 1 
                ? 'Checkmate in 1' 
                : `${puzzle.solution.length} moves`}
            </Text>
          </View>
        </View>
      </Card>
      
      {/* Chessboard */}
      <View style={styles.boardContainer}>
        <ChessboardControl
          fen={puzzle.fen}
          solution={puzzle.solution}
          onSolve={handleSolve}
          boardSize={boardSize}
        />
      </View>
      
      {/* Solution actions */}
      <View style={styles.actionsContainer}>
        <Button
          title={showSolution ? "Hide Solution" : "Show Solution"}
          variant={showSolution ? "outline" : "secondary"}
          size="medium"
          onPress={() => setShowSolution(!showSolution)}
          style={styles.actionButton}
        />
        
        <Button
          title="Next Puzzle"
          variant="primary"
          size="medium"
          onPress={loadNextPuzzle}
          disabled={isLoading}
          style={styles.actionButton}
        />
      </View>
      
      {/* Solution explanation */}
      {showSolution && (
        <Card style={styles.solutionCard}>
          <Text style={styles.solutionTitle}>Solution</Text>
          
          <View style={styles.movesContainer}>
            {puzzle.solution.map((move, index) => (
              <View key={index} style={styles.moveItem}>
                <Text style={styles.moveNumber}>{Math.floor(index / 2) + 1}.</Text>
                <Text style={styles.moveText}>{move}</Text>
              </View>
            ))}
          </View>
          
          {puzzle.explanation && (
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationTitle}>Explanation:</Text>
              <Text style={styles.explanationText}>{puzzle.explanation}</Text>
            </View>
          )}
        </Card>
      )}
      
      {/* Success message */}
      {isSolved && (
        <Card style={styles.successCard}>
          <View style={styles.successHeader}>
            <TabBarIcon name="check-circle" color={theme.COLORS.success} size={24} />
            <Text style={styles.successTitle}>Puzzle Solved!</Text>
          </View>
          
          <Text style={styles.successText}>
            Great job! You've successfully solved this puzzle.
          </Text>
          
          <Button
            title="Share Success"
            variant="outline"
            size="small"
            onPress={() => {
              // Share functionality would go here
              Alert.alert('Share', 'Sharing functionality would go here');
            }}
            style={styles.shareButton}
          />
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
  },
  contentContainer: {
    padding: theme.SPACING.md,
    paddingBottom: theme.SPACING.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.TYPOGRAPHY.fontSize.lg,
    color: theme.COLORS.text.secondary,
  },
  puzzleInfoCard: {
    marginBottom: theme.SPACING.md,
  },
  puzzleName: {
    fontSize: theme.TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: theme.COLORS.text.primary,
    marginBottom: theme.SPACING.xs,
  },
  puzzleMetaRow: {
    flexDirection: 'row',
    marginTop: theme.SPACING.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.SPACING.md,
  },
  metaText: {
    fontSize: theme.TYPOGRAPHY.fontSize.sm,
    color: theme.COLORS.text.secondary,
    marginLeft: theme.SPACING.xs,
  },
  boardContainer: {
    alignItems: 'center',
    marginBottom: theme.SPACING.md,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.SPACING.md,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: theme.SPACING.xs,
  },
  solutionCard: {
    marginBottom: theme.SPACING.md,
    backgroundColor: theme.COLORS.background,
  },
  solutionTitle: {
    fontSize: theme.TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: theme.COLORS.text.primary,
    marginBottom: theme.SPACING.md,
  },
  movesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.SPACING.md,
  },
  moveItem: {
    flexDirection: 'row',
    marginRight: theme.SPACING.md,
    marginBottom: theme.SPACING.sm,
  },
  moveNumber: {
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    color: theme.COLORS.text.secondary,
    marginRight: theme.SPACING.xs,
  },
  moveText: {
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    fontWeight: 'bold',
    color: theme.COLORS.text.primary,
  },
  explanationContainer: {
    marginTop: theme.SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: theme.SPACING.sm,
  },
  explanationTitle: {
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    fontWeight: 'bold',
    color: theme.COLORS.text.primary,
    marginBottom: theme.SPACING.xs,
  },
  explanationText: {
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    color: theme.COLORS.text.secondary,
    lineHeight: theme.TYPOGRAPHY.lineHeight.md,
  },
  successCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: theme.COLORS.success,
  },
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.SPACING.sm,
  },
  successTitle: {
    fontSize: theme.TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: theme.COLORS.success,
    marginLeft: theme.SPACING.sm,
  },
  successText: {
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    color: theme.COLORS.text.primary,
    marginBottom: theme.SPACING.md,
  },
  shareButton: {
    alignSelf: 'flex-start',
  },
});

export default PuzzleScreen;