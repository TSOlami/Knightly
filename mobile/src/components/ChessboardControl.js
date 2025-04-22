import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Alert, Modal } from 'react-native';
import Chessboard from 'react-native-chessboard';
import { Chess } from 'chess.js';
import Button from './Button';
import theme from '../theme';
import * as chessUtils from '../utils/chessUtils';
import TabBarIcon from './TabBarIcon';
import { useSound } from '../context/SoundContext';
import { useAuth } from '../context/AuthContext';
import Card from './Card';

const ChessboardControl = ({
  fen,
  solution,
  onSolve,
  boardSize = 350,
  opponentMoveDelay = 500,
}) => {
  const { playSound } = useSound();
  const { user } = useAuth();
  
  // Get user preferences with defaults
  const showValidMoves = user?.preferences?.moveHighlights ?? true;
  const animationsEnabled = user?.preferences?.animations ?? true;
  
  const [chess, setChess] = useState(new Chess(fen));
  const [playerMoves, setPlayerMoves] = useState([]);
  const [hintSquares, setHintSquares] = useState({ from: null, to: null });
  const [highlightedSquares, setHighlightedSquares] = useState({});
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [isOpponentMoving, setIsOpponentMoving] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const initialFen = useRef(fen);
  const initialChess = useRef(new Chess(fen));
  const chessboardRef = useRef(null);

  useEffect(() => {
    // Reset everything when a new puzzle is loaded
    const newChess = new Chess(fen);
    setChess(newChess);
    setPlayerMoves([]);
    setHintSquares({ from: null, to: null });
    setHighlightedSquares({});
    setSelectedSquare(null);
    setIsOpponentMoving(false);
    setSuccessModalVisible(false);
    
    // Update refs
    initialFen.current = fen;
    initialChess.current = new Chess(fen);
    
    // Set player color to the starting turn
    setPlayerColor(newChess.turn());
    
    // Reset the board visually
    if (chessboardRef.current) {
      chessboardRef.current.resetBoard(fen);
    }
  }, [fen]);

  const makeOpponentMove = async () => {
    if (!chess || isOpponentMoving || playerMoves.length >= solution.length) return;
    
    setIsOpponentMoving(true);
    try {
      const moveCount = playerMoves.length;
      const nextMove = solution[moveCount];
      if (nextMove) {
        const move = chessUtils.convertAlgebraicToCoords(chess, nextMove);
        if (move) {
          const moveResult = chess.move({ from: move.from, to: move.to, promotion: "q" });
          if (moveResult) {
            // Play appropriate sound
            if (moveResult.captured) {
              playSound('capture');
            } else if (moveResult.san.includes('+')) {
              playSound('check');
            } else {
              playSound('move');
            }
            
            const newChess = new Chess(chess.fen());
            setChess(newChess);
            
            // Use animations based on user preferences
            if (animationsEnabled) {
              chessboardRef.current.move({ from: move.from, to: move.to });
            } else {
              // Just update the board without animation
              chessboardRef.current.resetBoard(newChess.fen());
            }
            
            handleMoveComplete(moveResult);
          }
        }
      }
    } catch (error) {
      console.error("Error making opponent move:", error);
      playSound('error');
      Alert.alert("Error", "Invalid opponent move. Resetting puzzle.");
      resetBoard();
    } finally {
      setIsOpponentMoving(false);
    }
  };

  useEffect(() => {
    if (chess.turn() !== playerColor && !isOpponentMoving && playerMoves.length < solution.length) {
      const timer = setTimeout(makeOpponentMove, opponentMoveDelay);
      return () => clearTimeout(timer);
    }
  }, [chess.fen(), playerMoves.length]);

  const resetBoard = () => {
    const newChess = new Chess(initialFen.current);
    setChess(newChess);
    setPlayerMoves([]);
    setHintSquares({ from: null, to: null });
    setHighlightedSquares({});
    setSelectedSquare(null);
    setPlayerColor(newChess.turn());
    setIsOpponentMoving(false);
    setSuccessModalVisible(false);
    
    if (chessboardRef.current) {
      chessboardRef.current.resetBoard(initialFen.current);
    }
  };

  const undoMove = () => {
    if (playerMoves.length === 0) return;
    
    playSound('move');
    
    const newChess = new Chess(chess.fen());
    newChess.undo();
    setChess(newChess);
    
    setPlayerMoves(prev => prev.slice(0, -1));
    setHintSquares({ from: null, to: null });
    setHighlightedSquares({});
    setSelectedSquare(null);
    
    chessboardRef.current.resetBoard(newChess.fen());
  };

  const getHint = () => {
    if (chess.turn() !== playerColor) return;
    
    const moveCount = playerMoves.length;
    const nextSolutionMove = solution[moveCount];
    if (!nextSolutionMove) return;
    
    const hint = chessUtils.convertAlgebraicToCoords(chess, nextSolutionMove);
    if (hint) {
      const newHighlights = {
        [hint.from]: { backgroundColor: theme.COLORS.board.highlight },
        [hint.to]: { backgroundColor: theme.COLORS.board.highlight }
      };
      setHighlightedSquares(newHighlights);
    }
  };

  const handleMoveComplete = (moveObj) => {
    const moveCount = playerMoves.length;
    const expectedMove = solution[moveCount];
    const expectedMoveCoords = chessUtils.convertAlgebraicToCoords(initialChess.current, expectedMove);
    
    // Check if the move matches the solution
    const isCorrectMove = expectedMoveCoords && 
      moveObj.from === expectedMoveCoords.from && 
      moveObj.to === expectedMoveCoords.to;

    if (!isCorrectMove) {
      // Play error sound
      playSound('error');
      
      // Show feedback for wrong move
      Alert.alert(
        "Incorrect Move",
        "That's not the best move in this position. Try again!",
        [{ 
          text: "OK",
          onPress: () => {
            // Undo the wrong move
            const newChess = new Chess(chess.fen());
            newChess.undo();
            setChess(newChess);
            chessboardRef.current.resetBoard(newChess.fen());
          }
        }]
      );
      return;
    }

    // If it was a correct move
    setPlayerMoves(prev => [...prev, moveObj]);
    setHintSquares({ from: null, to: null });
    setHighlightedSquares({});
    setSelectedSquare(null);

    if (playerMoves.length + 1 === solution.length) {
      // Play completion sound
      playSound('complete');
      
      // Show success modal
      setSuccessModalVisible(true);
      
      // Also call the onSolve callback
      setTimeout(() => onSolve?.(playerMoves), 500);
    }
  };

  const onSquareClick = (square) => {
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setHighlightedSquares({});
      return;
    }
    
    if (!selectedSquare) {
      const piece = chess.get(square);
      if (piece) {
        setSelectedSquare(square);
        
        // Only highlight valid moves if the setting is enabled
        if (showValidMoves) {
          const newHighlights = { [square]: { backgroundColor: theme.COLORS.board.selected } };
          chess.moves({ square, verbose: true }).forEach(move => {
            newHighlights[move.to] = { backgroundColor: theme.COLORS.board.validMove };
          });
          setHighlightedSquares(newHighlights);
        } else {
          // Just highlight the selected square
          setHighlightedSquares({ [square]: { backgroundColor: theme.COLORS.board.selected } });
        }
      }
    } else {
      try {
        const move = chess.move({ from: selectedSquare, to: square, promotion: 'q' });
        if (move) {
          // Play appropriate sound
          if (move.captured) {
            playSound('capture');
          } else if (move.san.includes('+')) {
            playSound('check');
          } else {
            playSound('move');
          }
          
          const newChess = new Chess(chess.fen());
          setChess(newChess);
          
          // Use animations based on user preferences
          if (animationsEnabled) {
            chessboardRef.current.move({ from: selectedSquare, to: square });
          } else {
            // Just update the board without animation
            chessboardRef.current.resetBoard(newChess.fen());
          }
          
          handleMoveComplete(move);
        }
      } catch {
        setSelectedSquare(null);
        setHighlightedSquares({});
      }
    }
  };

  const getSquareStyles = () => {
    const styles = { ...highlightedSquares };
    if (chess.isCheck()) {
      const kingSquare = findKingSquare(chess, chess.turn());
      if (kingSquare) styles[kingSquare] = { backgroundColor: theme.COLORS.board.check };
    }
    return styles;
  };

  const findKingSquare = (chess, color) => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = chess.board()[row][col];
        if (square?.type === 'k' && square.color === color) {
          return String.fromCharCode(97 + col) + (8 - row);
        }
      }
    }
    return null;
  };
  
  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.boardContainer}>
        <Chessboard
          ref={chessboardRef}
          fen={chess.fen()}
          boardSize={boardSize}
          colors={{ black: theme.COLORS.board.dark, white: theme.COLORS.board.light }}
          onPress={onSquareClick}
          squareStyles={getSquareStyles()}
        />
      </View>
      
      <View style={styles.controlsContainer}>
        <View style={styles.iconButton}>
          <Button onPress={resetBoard} variant="icon" size="medium">
            <TabBarIcon name="rotate" color={theme.COLORS.primary} size={22} />
          </Button>
          <Text style={styles.iconLabel}>Reset</Text>
        </View>
        
        <View style={styles.iconButton}>
          <Button onPress={undoMove} variant="icon" size="medium" disabled={playerMoves.length === 0}>
            <TabBarIcon 
              name="arrow-left" 
              color={playerMoves.length === 0 ? theme.COLORS.text.disabled : theme.COLORS.primary} 
              size={22} 
            />
          </Button>
          <Text style={styles.iconLabel}>Undo</Text>
        </View>
        
        <View style={styles.iconButton}>
          <Button onPress={getHint} variant="icon" size="medium">
            <TabBarIcon name="help-circle" color={theme.COLORS.primary} size={22} />
          </Button>
          <Text style={styles.iconLabel}>Hint</Text>
        </View>
      </View>
      
      {/* Success Modal */}
      <Modal
        visible={successModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeSuccessModal}
      >
        <View style={styles.modalOverlay}>
          <Card title="Puzzle Solved!" style={styles.modalCard}>
            <Text style={styles.modalText}>Great job! You found all the correct moves and solved the puzzle.</Text>
            
            <View style={styles.modalButtons}>
              <Button
                title="Continue"
                onPress={closeSuccessModal}
                style={styles.modalButton}
              />
            </View>
          </Card>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  boardContainer: {
    marginBottom: 16,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 16,
  },
  iconButton: {
    alignItems: 'center',
  },
  iconLabel: {
    marginTop: 4,
    fontSize: 12,
    color: theme.COLORS.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '90%',
    maxWidth: 400,
  },
  modalText: {
    fontSize: 16,
    color: theme.COLORS.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButton: {
    minWidth: 120,
  },
});

export default ChessboardControl;