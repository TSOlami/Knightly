import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Alert,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-native-chessboard';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Haptics from 'expo-haptics';

import { puzzlesByCategory, getAllPuzzles } from '../../puzzles';
import { COLORS, SIZES, SHADOWS } from '../../theme';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 32, 400);

export default function PuzzleScreen() {
  const { id } = useLocalSearchParams();
  const puzzleId = parseInt(id, 10);
  const allPuzzles = getAllPuzzles();
  const puzzle = allPuzzles.find((p) => p.id === puzzleId);
  const router = useRouter();

  const [game, setGame] = useState(null);
  const [fen, setFen] = useState('');
  const [moveHistory, setMoveHistory] = useState([]);
  const [solved, setSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [moveInProgress, setMoveInProgress] = useState(false);
  
  // Animation values
  const boardOpacity = useRef(new Animated.Value(0)).current;
  const headerY = useRef(new Animated.Value(-50)).current;
  const controlsY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (puzzle) {
      initializePuzzle();
      animateScreenElements();
    }
  }, [puzzleId, puzzle]);

  const initializePuzzle = () => {
    try {
      const newGame = new Chess(puzzle.fen);
      setGame(newGame);
      setFen(puzzle.fen);
      setMoveHistory([puzzle.fen]);
      setSolved(false);
      setAttempts(0);
      setShowHint(false);
    } catch (e) {
      console.error("Error initializing puzzle:", e);
    }
  };

  const animateScreenElements = () => {
    // Reset animation values
    boardOpacity.setValue(0);
    headerY.setValue(-50);
    controlsY.setValue(50);
    
    // Animate elements in sequence
    Animated.sequence([
      Animated.timing(headerY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(boardOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(controlsY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleMove = (move) => {
    if (moveInProgress || solved) return false;
    
    setMoveInProgress(true);
    try {
      // Make a copy of the game to test the move
      const gameCopy = new Chess(fen);
      
      // Try to make the move
      const result = gameCopy.move({
        from: move.from,
        to: move.to,
        promotion: move.promotion || 'q', // Default to queen promotion
      });
      
      // If the move is not legal, return false
      if (!result) {
        setMoveInProgress(false);
        return false;
      }
      
      // Provide haptic feedback for a successful move
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Update the game state
      setGame(gameCopy);
      setFen(gameCopy.fen());
      setMoveHistory([...moveHistory, gameCopy.fen()]);
      
      // Check if the move resulted in checkmate
      const isCorrectMove = checkSolution(move, puzzle);
      
      if (isCorrectMove) {
        // Success!
        setSolved(true);
        setTimeout(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          showSuccessAlert();
        }, 500);
      } else {
        // Not the right move
        setAttempts(attempts + 1);
        setTimeout(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          showWrongMoveAlert();
        }, 500);
      }
      
      setMoveInProgress(false);
      return true;
    } catch (e) {
      console.error("Move error:", e);
      setMoveInProgress(false);
      return false;
    }
  };

  const checkSolution = (move, puzzle) => {
    if (!puzzle || !move) return false;
    
    // For checkmate in 1 puzzles
    if (typeof puzzle.solution === 'string') {
      // Convert move to algebraic notation
      let moveNotation = `${move.from}${move.to}`;
      if (move.promotion) moveNotation += move.promotion;
      
      // Check if the move leads to checkmate
      const tempGame = new Chess(puzzle.fen);
      tempGame.move({ from: move.from, to: move.to, promotion: move.promotion });
      return tempGame.isCheckmate() && puzzle.solution.includes(move.to);
    }
    
    // For multi-move puzzles, check first move only
    else if (Array.isArray(puzzle.solution) && puzzle.solution.length > 0) {
      const firstSolution = puzzle.solution[0];
      const tempGame = new Chess(puzzle.fen);
      const possibleMoves = tempGame.moves({ verbose: true });
      
      // Find a move that matches the solution
      const solutionMove = possibleMoves.find(m => {
        const algebraic = tempGame.move(m).san;
        tempGame.undo();
        return algebraic === firstSolution;
      });
      
      if (!solutionMove) return false;
      
      // Check if user's move matches solution move
      return solutionMove.from === move.from && solutionMove.to === move.to;
    }
    
    return false;
  };

  const showSuccessAlert = () => {
    Alert.alert(
      "Perfect Move!",
      `You solved the puzzle in ${attempts + 1} attempt${attempts !== 0 ? 's' : ''}!`,
      [
        {
          text: "Next Puzzle",
          onPress: handleNextPuzzle,
          style: "default"
        },
        { 
          text: "Try Again",
          onPress: handleReset,
          style: "cancel"
        }
      ]
    );
  };

  const showWrongMoveAlert = () => {
    Alert.alert(
      "Not Quite Right",
      attempts >= 2 ? "Would you like a hint?" : "That's not the best move. Try again!",
      attempts >= 2 ? 
      [
        { text: "Show Hint", onPress: () => setShowHint(true) },
        { text: "Try Again", onPress: handleUndo }
      ] :
      [{ text: "OK", onPress: handleUndo }]
    );
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    initializePuzzle();
  };

  const handleUndo = () => {
    if (moveHistory.length > 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const previousFen = moveHistory[moveHistory.length - 2];
      const newHistory = moveHistory.slice(0, -1);
      const newGame = new Chess(previousFen);
      
      setGame(newGame);
      setFen(previousFen);
      setMoveHistory(newHistory);
    }
  };

  const handleNextPuzzle = () => {
    // Find the next puzzle with ID greater than current
    const nextPuzzle = allPuzzles.find(p => p.id > puzzleId);
    if (nextPuzzle) {
      router.replace(`/puzzle/${nextPuzzle.id}`);
    } else {
      // If there's no next puzzle, go back to home screen
      router.replace('/');
    }
  };

  const handlePrevPuzzle = () => {
    // Find the previous puzzle with ID less than current
    const prevPuzzle = allPuzzles.filter(p => p.id < puzzleId).pop();
    if (prevPuzzle) {
      router.replace(`/puzzle/${prevPuzzle.id}`);
    }
  };

  if (!puzzle) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.puzzleNotFound}>Puzzle not found</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/')}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Get player turn
  const playerTurn = game ? (game.turn() === 'w' ? 'White' : 'Black') : '';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.headerBackground}
      />

      <Animated.View 
        style={[
          styles.header, 
          { transform: [{ translateY: headerY }] }
        ]}
      >
        <View style={styles.puzzleDetails}>
          <View>
            <Text style={styles.puzzleName}>{puzzle.name}</Text>
            <View style={styles.puzzleStats}>
              <Icon name="chess-pawn" size={14} color="white" style={styles.statsIcon} />
              <Text style={styles.puzzleDifficulty}>
                Difficulty: {Array(puzzle.difficulty).fill('●').join(' ')}
              </Text>
            </View>
          </View>
          <View style={styles.turnIndicator}>
            <View style={[
              styles.turnDot, 
              { backgroundColor: playerTurn === 'White' ? 'white' : '#333' }
            ]} />
            <Text style={styles.turnText}>{playerTurn} to play</Text>
          </View>
        </View>
        
        <Text style={styles.puzzleInstructions}>
          {showHint ? puzzle.hint : "Find the best move"}
        </Text>
      </Animated.View>

      <View style={styles.boardWrapper}>
        <Animated.View style={{ opacity: boardOpacity }}>
          {game && fen && (
            <Chessboard
              fen={fen}
              onMove={handleMove}
              boardSize={BOARD_SIZE}
            />
          )}
        </Animated.View>

        {solved && (
          <View style={styles.solvedOverlay}>
            <Icon name="trophy" size={50} color={COLORS.accent} />
            <Text style={styles.solvedText}>Puzzle Solved!</Text>
          </View>
        )}
      </View>
      
      <Animated.View 
        style={[
          styles.controlsContainer, 
          { transform: [{ translateY: controlsY }] }
        ]}
      >
        <View style={styles.puzzleNavigation}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={handlePrevPuzzle}
            disabled={!allPuzzles.some(p => p.id < puzzleId)}
          >
            <Icon name="chevron-left" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.puzzleCounter}>
            Puzzle {allPuzzles.findIndex(p => p.id === puzzleId) + 1} of {allPuzzles.length}
          </Text>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={handleNextPuzzle}
            disabled={!allPuzzles.some(p => p.id > puzzleId)}
          >
            <Icon name="chevron-right" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
            <Icon name="undo-alt" size={16} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.hintButton]} 
            onPress={() => setShowHint(!showHint)}
          >
            <Icon name="lightbulb" size={16} color="#fff" style={styles.buttonIcon} solid={showHint} />
            <Text style={styles.buttonText}>{showHint ? "Hide Hint" : "Show Hint"}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.homeButton]} 
            onPress={() => router.replace('/')}
          >
            <Icon name="home" size={16} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...SHADOWS.medium,
  },
  header: {
    paddingHorizontal: SIZES.l,
    paddingTop: SIZES.m,
    paddingBottom: SIZES.l,
    zIndex: 1,
  },
  puzzleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.s,
  },
  puzzleName: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  puzzleStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsIcon: {
    marginRight: 6,
  },
  puzzleDifficulty: {
    fontSize: SIZES.caption,
    color: 'rgba(255,255,255,0.9)',
  },
  turnIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  turnDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  turnText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  puzzleInstructions: {
    fontSize: SIZES.body,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
  },
  boardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.l,
    marginBottom: SIZES.l,
    position: 'relative',
  },
  solvedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  solvedText: {
    color: '#fff',
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    marginTop: SIZES.s,
  },
  controlsContainer: {
    paddingHorizontal: SIZES.l,
    marginTop: SIZES.l,
  },
  puzzleNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.m,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  puzzleCounter: {
    fontSize: SIZES.body,
    color: COLORS.text,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.s,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: SIZES.radiusMd,
    flex: 1,
    marginHorizontal: 4,
    ...SHADOWS.small,
  },
  resetButton: {
    backgroundColor: COLORS.secondary,
  },
  hintButton: {
    backgroundColor: COLORS.accent,
  },
  homeButton: {
    backgroundColor: COLORS.primary,
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  puzzleNotFound: {
    fontSize: SIZES.h3,
    color: COLORS.text,
    marginBottom: SIZES.l,
  },
});