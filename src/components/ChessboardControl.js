import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Chessboard } from 'react-native-chessboard';
import { Chess } from 'chess.js';
import Button from './Button';
import theme from '../theme';
import * as chessUtils from '../utils/chessUtils';

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

  // Handle piece movement
  const onMove = ({ from, to }) => {
    try {
      // Create a new chess instance to avoid mutation
      const newChess = new Chess(chess.fen());
      
      // Attempt to make the move
      const moveObj = chessUtils.makeMove(newChess, from, to);
      if (!moveObj) return false;
      
      // Update the chess instance and player moves
      setChess(newChess);
      
      const newPlayerMoves = [...playerMoves, moveObj];
      setPlayerMoves(newPlayerMoves);
      
      // Clear hints and highlights
      setHintSquares({ from: null, to: null });
      setHighlightedSquares({});
      
      // Check if the puzzle is solved
      const isCorrect = chessUtils.verifySolution(
        initialChess.current, 
        solution, 
        newPlayerMoves
      );
      
      if (isCorrect && newPlayerMoves.length === solution.length) {
        // Puzzle is solved
        Alert.alert('Success!', 'You solved the puzzle correctly!');
        if (onSolve) onSolve(newPlayerMoves);
      } else if (newPlayerMoves.length === solution.length && !isCorrect) {
        // Player made the wrong moves
        Alert.alert('Incorrect', 'That\'s not the correct solution. Try again!');
      }
      
      // Checkmate detection
      if (newChess.isCheckmate()) {
        if (isCorrect) {
          Alert.alert('Checkmate!', 'You delivered checkmate!');
        } else {
          Alert.alert('Checkmate!', 'You found a different checkmate than the intended solution.');
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error making move:', error);
      return false;
    }
  };
  
  // Get custom square styles
  const customSquareStyles = () => {
    const styles = { ...highlightedSquares };
    
    // Highlight the king if in check
    if (chess.isCheck()) {
      const turn = chess.turn();
      const king = chess.board().flat().find(
        piece => piece && piece.type === 'k' && piece.color === turn
      );
      
      if (king) {
        const file = 'abcdefgh'[king.square.x];
        const rank = 8 - king.square.y;
        const square = `${file}${rank}`;
        
        styles[square] = {
          backgroundColor: theme.COLORS.board.check,
        };
      }
    }
    
    return styles;
  };

  return (
    <View style={styles.container}>
      <View style={styles.boardContainer}>
        <Chessboard
          fen={chess.fen()}
          onMove={onMove}
          size={boardSize}
          showValidMoves={showValidMoves}
          validMoveColor={theme.COLORS.board.validMove}
          squareStyles={customSquareStyles()}
        />
      </View>
      
      <View style={styles.controlsContainer}>
        <Button 
          title="Reset" 
          onPress={resetBoard} 
          variant="outline"
          size="small"
        />
        <Button 
          title="Undo" 
          onPress={undoMove} 
          variant="outline"
          size="small"
          disabled={playerMoves.length === 0}
        />
        <Button 
          title="Hint" 
          onPress={getHint} 
          variant="outline"
          size="small"
        />
      </View>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {chess.turn() === 'w' ? 'White' : 'Black'} to move
        </Text>
        {chess.isCheck() && (
          <Text style={styles.checkText}>CHECK!</Text>
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
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.SPACING.md,
  },
  statusText: {
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    fontWeight: 'bold',
    color: theme.COLORS.text.primary,
  },
  checkText: {
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    fontWeight: 'bold',
    color: theme.COLORS.error,
    marginLeft: theme.SPACING.md,
  },
});

export default ChessboardControl; 