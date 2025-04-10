import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-native-chessboard';
import { puzzles } from '../puzzles';

const PuzzleScreen = ({ route, navigation }) => {
  const { puzzleId } = route.params;
  const puzzle = puzzles.find((p) => p.id === puzzleId);
  
  const [game, setGame] = useState(null);
  const [fen, setFen] = useState('');
  const [moveHistory, setMoveHistory] = useState([]);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    if (puzzle) {
      const newGame = new Chess(puzzle.fen);
      setGame(newGame);
      setFen(puzzle.fen);
      setMoveHistory([puzzle.fen]);
      setSolved(false);
    }
  }, [puzzleId, puzzle]);

  const handleMove = (move) => {
    try {
      // Make a copy of the game to test the move
      const gameCopy = new Chess(fen);
      
      // Try to make the move
      const result = gameCopy.move({
        from: move.from,
        to: move.to,
        promotion: move.promotion || undefined,
      });
      
      // If the move is not legal, return false
      if (!result) return false;
      
      // Update the game state
      setGame(gameCopy);
      setFen(gameCopy.fen());
      setMoveHistory([...moveHistory, gameCopy.fen()]);
      
      // Check if the move resulted in checkmate
      if (gameCopy.isCheckmate()) {
        setSolved(true);
        Alert.alert(
          "Puzzle Solved!",
          "Great job! You found the checkmate in one move.",
          [
            {
              text: "Next Puzzle",
              onPress: () => {
                const nextPuzzleId = puzzleId + 1;
                const nextPuzzle = puzzles.find((p) => p.id === nextPuzzleId);
                if (nextPuzzle) {
                  navigation.replace('Puzzle', { puzzleId: nextPuzzleId });
                } else {
                  navigation.navigate('Home');
                }
              }
            },
            { 
              text: "Try Again",
              onPress: handleReset,
              style: "cancel"
            }
          ]
        );
      } else {
        // If not checkmate, it wasn't the correct solution
        Alert.alert(
          "Not Quite Right",
          "That move didn't result in checkmate. Try again!",
          [
            { 
              text: "OK",
              onPress: handleUndo
            }
          ]
        );
      }
      
      return true;
    } catch (e) {
      console.error("Move error:", e);
      return false;
    }
  };

  const handleReset = () => {
    const newGame = new Chess(puzzle.fen);
    setGame(newGame);
    setFen(puzzle.fen);
    setMoveHistory([puzzle.fen]);
    setSolved(false);
  };

  const handleUndo = () => {
    if (moveHistory.length > 1) {
      const previousFen = moveHistory[moveHistory.length - 2];
      const newHistory = moveHistory.slice(0, -1);
      const newGame = new Chess(previousFen);
      
      setGame(newGame);
      setFen(previousFen);
      setMoveHistory(newHistory);
    }
  };

  const handleHint = () => {
    Alert.alert("Hint", puzzle.hint);
  };

  if (!puzzle) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Puzzle not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.header}>
          <Text style={styles.puzzleTitle}>{puzzle.name}</Text>
          <Text style={styles.puzzleInstructions}>Find the checkmate in one move</Text>
        </View>
        
        <View style={styles.boardContainer}>
          {game && fen && (
            <Chessboard
              key={`board-${puzzleId}-${Platform.OS}`}
              fen={fen}
              onMove={handleMove}
              boardSize={350}
              enableUserMoves={true}
            />
          )}
        </View>
        
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleReset}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleUndo}>
            <Text style={styles.buttonText}>Undo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleHint}>
            <Text style={styles.buttonText}>Hint</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  safeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  puzzleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  puzzleInstructions: {
    fontSize: 16,
    color: '#666',
    marginTop: 6,
  },
  boardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4a6ea9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default PuzzleScreen;