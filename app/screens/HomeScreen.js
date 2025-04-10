import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { puzzles } from '../puzzles';

const HomeScreen = ({ navigation }) => {
  const renderPuzzleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.puzzleItem}
      onPress={() => navigation.navigate('Puzzle', { puzzleId: item.id })}
    >
      <Text style={styles.puzzleName}>{item.name}</Text>
      <Text style={styles.puzzleHint}>Hint: {item.hint}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Knightly</Text>
      <Text style={styles.subtitle}>Checkmate in One Puzzles</Text>
      <FlatList
        data={puzzles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPuzzleItem}
        contentContainerStyle={styles.puzzleList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  puzzleList: {
    padding: 16,
  },
  puzzleItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  puzzleName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  puzzleHint: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;