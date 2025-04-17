import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import ChessboardControl from '../components/ChessboardControl';
import Button from '../components/Button';
import Card from '../components/Card';
import theme from '../theme';
import { getPuzzleById } from '../data/puzzles';
import TabBarIcon from '../components/TabBarIcon';

const { width } = Dimensions.get('window');
const boardSize = Math.min(width - 32, 400);

const PuzzleScreen = ({ route, navigation }) => {
  const { puzzleId, puzzle: puzzleParam } = route.params;
  const [puzzle, setPuzzle] = useState(puzzleParam || null);
  const [isSolved, setIsSolved] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  
  // Fetch puzzle if not provided in params
  useEffect(() => {
    if (!puzzle && puzzleId) {
      const foundPuzzle = getPuzzleById(puzzleId);
      if (foundPuzzle) {
        setPuzzle(foundPuzzle);
      } else {
        Alert.alert('Error', 'Puzzle not found');
        navigation.goBack();
      }
    }
  }, [puzzleId, puzzle, navigation]);
  
  // Handle puzzle solved
  const handleSolve = (moves) => {
    setIsSolved(true);
    setMoveHistory(moves);
    
    // Could save progress to app state/storage here
  };
  
  // If puzzle not loaded yet, show loading
  if (!puzzle) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading puzzle...</Text>
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
          
          <View style={styles.metaItem}>
            <TabBarIcon 
              name={puzzle.fen.includes(' w ') ? 'circle' : 'circle-fill'} 
              color={theme.COLORS.text.secondary} 
              size={16} 
            />
            <Text style={styles.metaText}>
              {puzzle.fen.includes(' w ') ? 'White' : 'Black'} to move
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
          onPress={() => {
            // Get a random puzzle from the same category
            const nextPuzzleId = 'cm1-003'; // Placeholder - would normally get next puzzle
            const nextPuzzle = getPuzzleById(nextPuzzleId);
            
            if (nextPuzzle) {
              // Reset state and navigate to the next puzzle
              setIsSolved(false);
              setShowSolution(false);
              setMoveHistory([]);
              
              navigation.setParams({
                puzzleId: nextPuzzle.id,
                puzzleName: nextPuzzle.name,
                puzzle: nextPuzzle,
              });
              
              setPuzzle(nextPuzzle);
            }
          }}
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