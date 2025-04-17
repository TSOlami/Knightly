import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Chess } from 'chess.js';
import theme from '../theme';

const PuzzleCard = ({ puzzle, onPress, completed = false }) => {
  const { name, fen, solution } = puzzle;
  
  // Determine if white or black is to move
  const chess = new Chess(fen);
  const isWhiteToMove = chess.turn() === 'w';
  
  // Determine number of moves in the solution
  const moveCount = solution.length;

  // Determine puzzle type based on solution
  const getPuzzleType = () => {
    const lastMove = solution[solution.length - 1];
    if (lastMove.includes('#')) {
      return `Checkmate in ${Math.ceil(solution.length / 2)}`;
    }
    return `Find the best move${solution.length > 1 ? 's' : ''}`;
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        completed && styles.completedCard
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.leftContainer}>
        <View style={[
          styles.colorIndicator,
          isWhiteToMove ? styles.whiteIndicator : styles.blackIndicator,
        ]} />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.puzzleType}>{getPuzzleType()}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.movesContainer}>
          <Text style={styles.movesCount}>{moveCount}</Text>
          <Text style={styles.movesLabel}>
            {moveCount === 1 ? 'Move' : 'Moves'}
          </Text>
        </View>
        
        {completed && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>Solved</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.md,
    marginVertical: theme.SPACING.sm,
    overflow: 'hidden',
    ...theme.SHADOWS.small,
  },
  completedCard: {
    borderLeftColor: theme.COLORS.success,
    borderLeftWidth: 4,
  },
  leftContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.COLORS.board.dark,
  },
  whiteIndicator: {
    backgroundColor: theme.COLORS.pieces.white,
  },
  blackIndicator: {
    backgroundColor: theme.COLORS.pieces.black,
  },
  contentContainer: {
    flex: 1,
    padding: theme.SPACING.md,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    fontWeight: 'bold',
    color: theme.COLORS.text.primary,
    marginBottom: theme.SPACING.xs,
  },
  puzzleType: {
    fontSize: theme.TYPOGRAPHY.fontSize.sm,
    color: theme.COLORS.text.secondary,
  },
  infoContainer: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.COLORS.background,
    padding: theme.SPACING.sm,
  },
  movesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  movesCount: {
    fontSize: theme.TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    color: theme.COLORS.text.primary,
  },
  movesLabel: {
    fontSize: theme.TYPOGRAPHY.fontSize.xs,
    color: theme.COLORS.text.secondary,
  },
  completedBadge: {
    backgroundColor: theme.COLORS.success,
    paddingHorizontal: theme.SPACING.sm,
    paddingVertical: theme.SPACING.xs,
    borderRadius: theme.BORDER_RADIUS.sm,
    marginTop: theme.SPACING.sm,
  },
  completedText: {
    color: theme.COLORS.white,
    fontSize: theme.TYPOGRAPHY.fontSize.xs,
    fontWeight: 'bold',
  },
});

export default PuzzleCard; 