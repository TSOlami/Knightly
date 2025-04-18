import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ChessboardContainer } from 'react-native-chessboard';
import { Chess } from 'chess.js';
import Button from './Button';
import theme from '../theme';
import * as chessUtils from '../utils/chessUtils';
import TabBarIcon from './TabBarIcon';

const ChessboardControl = ({
  fen,
  solution,
  onSolve,
  showValidMoves = true,
  boardSize = 350,
}) => {
  // Create a chess.js instance from FEN
  const [chess, setChess] = useState(new Chess(fen));
  const [playerMoves, setPlayerMoves] = useState([]);
  const [hintSquares, setHintSquares] = useState({ from: null, to: null });
  const [highlightedSquares, setHighlightedSquares] = useState({});
  const initialFen = useRef(fen);
  const initialChess = useRef(new Chess(fen));
  
  // When FEN changes (e.g., new puzzle), reset the board
  useEffect(() => {
    initialFen.current = fen;
    initialChess.current = new Chess(fen);
    resetBoard();
  }, [fen]);

  // Reset board to initial position
  const resetBoard = () => {
    const newChess = new Chess(initialFen.current);
    setChess(newChess);
    setPlayerMoves([]);
    setHintSquares({ from: null, to: null });
    setHighlightedSquares({});
  };

  // Undo the last move
  const undoMove = () => {
    if (playerMoves.length === 0) return;
    
    const newChess = new Chess(chess.fen());
    newChess.undo();
    setChess(newChess);
    
    const newPlayerMoves = [...playerMoves];
    newPlayerMoves.pop();
    setPlayerMoves(newPlayerMoves);
    
    // Clear hints and highlights
    setHintSquares({ from: null, to: null });
    setHighlightedSquares({});
  };

  // Get a hint for the current position
  const getHint = () => {
    // Clone the current chess instance
    const currentChess = new Chess(chess.fen());
    
    // Get all moves made so far
    const moveCount = playerMoves.length;
    
    // Get the next move in the solution sequence
    const nextSolutionMove = solution[moveCount];
    if (!nextSolutionMove) return;
    
    // Get the from/to coordinates for the hint
    const hint = chessUtils.convertAlgebraicToCoords(currentChess, nextSolutionMove);
    if (hint) {
      setHintSquares(hint);
      
      // Highlight the hint squares
      const newHighlights = {};
      if (hint.from) newHighlights[hint.from] = { backgroundColor: theme.COLORS.board.highlight };
      if (hint.to) newHighlights[hint.to] = { backgroundColor: theme.COLORS.board.highlight };
      setHighlightedSquares(newHighlights);
    }
  };

  // Get custom square styles
  const getSquareStyles = () => {
    const styles = { ...highlightedSquares };
    
    // Highlight the king if in check
    if (chess.isCheck()) {
      const turn = chess.turn();
      const kingSquare = findKingSquare(chess, turn);
      
      if (kingSquare) {
        styles[kingSquare] = {
          backgroundColor: theme.COLORS.board.check,
        };
      }
    }
    
    return styles;
  };

  // Helper function to find the king's square
  const findKingSquare = (chess, color) => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = chess.board()[row][col];
        if (square && square.type === 'k' && square.color === color) {
          const file = 'abcdefgh'[col];
          const rank = 8 - row;
          return `${file}${rank}`;
        }
      }
    }
    return null;
  };

  // Handle move input
  const onSquareClick = (square) => {
    // If the puzzle is already solved, don't allow more moves
    if (playerMoves.length >= solution.length) {
      return;
    }
    
    if (hintSquares.from === square) {
      // Clear highlight if clicking on the hint "from" square
      setHintSquares({ from: null, to: null });
      setHighlightedSquares({});
      return;
    }
    
    if (!hintSquares.from) {
      // No piece selected yet, try to select a piece
      const piece = chess.get(square);
      if (piece && piece.color === chess.turn()) {
        const newHighlights = {};
        newHighlights[square] = { backgroundColor: theme.COLORS.board.selected };
        
        // Show valid move squares if enabled
        if (showValidMoves) {
          const validMoves = chessUtils.getPossibleMoves(chess, square);
          validMoves.forEach(move => {
            newHighlights[move.to] = { backgroundColor: theme.COLORS.board.validMove };
          });
        }
        
        setHighlightedSquares(newHighlights);
        setHintSquares({ from: square, to: null });
      }
    } else {
      // A piece is already selected, try to move it
      const from = hintSquares.from;
      const to = square;
      
      try {
        const moveObj = chessUtils.makeMove(chess, from, to);
        if (moveObj) {
          // Update the chess instance
          const newChess = new Chess(chess.fen());
          setChess(newChess);
          
          // Add to player moves
          const newPlayerMoves = [...playerMoves, moveObj];
          setPlayerMoves(newPlayerMoves);
          
          // Clear hints and highlights
          setHintSquares({ from: null, to: null });
          setHighlightedSquares({});
          
          // Check if puzzle is solved
          const isCorrect = chessUtils.verifySolution(
            initialChess.current, 
            solution, 
            newPlayerMoves
          );
          
          if (isCorrect && newPlayerMoves.length === solution.length) {
            // Puzzle is solved
            setTimeout(() => {
              if (onSolve) onSolve(newPlayerMoves);
            }, 500); // Small delay to let the board update visually
          } else if (newPlayerMoves.length === solution.length && !isCorrect) {
            // Player made the wrong moves
            setTimeout(() => {
              resetBoard();
            }, 500);
          } else if (!isCorrect) {
            // Made an incorrect move in the sequence
            setTimeout(() => {
              undoMove();
            }, 500);
          }
        } else {
          // Invalid move, clear selection
          setHintSquares({ from: null, to: null });
          setHighlightedSquares({});
        }
      } catch (error) {
        console.error('Error making move:', error);
        setHintSquares({ from: null, to: null });
        setHighlightedSquares({});
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.boardContainer}>
        <ChessboardContainer
          fen={chess.fen()}
          boardSize={boardSize}
          customDarkSquareStyle={{
            backgroundColor: theme.COLORS.board.dark,
          }}
          customLightSquareStyle={{
            backgroundColor: theme.COLORS.board.light,
          }}
          customSquareStyles={getSquareStyles()}
          onSquareClick={onSquareClick}
          boardOrientation={chess.turn() === 'w' ? 'white' : 'black'}
        />
      </View>
      
      <View style={styles.controlsContainer}>
        <View style={styles.iconButton}>
          <Button 
            onPress={resetBoard} 
            variant="icon"
            size="medium"
          >
            <TabBarIcon name="rotate" color={theme.COLORS.primary} size={22} />
          </Button>
          <Text style={styles.iconLabel}>Reset</Text>
        </View>

        <View style={styles.iconButton}>
          <Button 
            onPress={undoMove} 
            variant="icon"
            size="medium"
            disabled={playerMoves.length === 0}
          >
            <TabBarIcon 
              name="arrow-undo" 
              color={playerMoves.length === 0 ? theme.COLORS.text.disabled : theme.COLORS.primary} 
              size={22} 
            />
          </Button>
          <Text style={styles.iconLabel}>Undo</Text>
        </View>

        <View style={styles.iconButton}>
          <Button 
            onPress={getHint}
            variant="icon"
            size="medium"
          >
            <TabBarIcon name="lightbulb" color={theme.COLORS.primary} size={22} />
          </Button>
          <Text style={styles.iconLabel}>Hint</Text>
        </View>
      </View>
      
      <View style={styles.statusContainer}>
        <View style={styles.turnIndicator}>
          <View style={[styles.turnCircle, { backgroundColor: chess.turn() === 'w' ? 'white' : 'black' }]} />
          <Text style={styles.statusText}>
            {chess.turn() === 'w' ? 'White' : 'Black'} to move
          </Text>
        </View>
        {chess.isCheck() && (
          <View style={styles.checkIndicator}>
            <TabBarIcon name="alert-circle" color={theme.COLORS.error} size={16} />
            <Text style={styles.checkText}>CHECK!</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  boardContainer: {
    ...theme.SHADOWS.medium,
    borderRadius: theme.BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: theme.SPACING.md,
    marginTop: theme.SPACING.md,
    maxWidth: 350,
  },
  iconButton: {
    alignItems: 'center',
    flex: 1,
  },
  iconLabel: {
    fontSize: theme.TYPOGRAPHY.fontSize.xs,
    color: theme.COLORS.text.secondary,
    marginTop: theme.SPACING.xs,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    marginTop: theme.SPACING.md,
    paddingHorizontal: theme.SPACING.md,
  },
  turnIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  turnCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: theme.SPACING.xs,
  },
  statusText: {
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    fontWeight: 'bold',
    color: theme.COLORS.text.primary,
  },
  checkIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkText: {
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    fontWeight: 'bold',
    color: theme.COLORS.error,
    marginLeft: theme.SPACING.xs,
  },
});

export default ChessboardControl; 