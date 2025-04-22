import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import puzzleService from '../services/puzzleService';

const HomeScreen = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [featuredPuzzles, setFeaturedPuzzles] = useState([]);
  const [puzzleStats, setPuzzleStats] = useState({});
  
  useEffect(() => {
    const fetchPuzzles = async () => {
      setLoading(true);
      try {
        // Get featured puzzles by difficulty from the API
        const puzzlesByDifficulty = await puzzleService.getPuzzlesByDifficulty(5);
        setFeaturedPuzzles(puzzlesByDifficulty);
        
        // Get puzzle stats
        const stats = await puzzleService.getStats();
        setPuzzleStats(stats);
      } catch (error) {
        console.error('Error fetching puzzles:', error);
        // You might want to show an error message to the user
      } finally {
        setLoading(false);
      }
    };
    
    fetchPuzzles();
  }, []);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Knightly</Text>
        {user && (
          <Text style={styles.subtitle}>
            Hello, {user.username || 'Player'}
          </Text>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.contentText}>
          Start solving chess puzzles and improve your skills.
        </Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => {
            // Navigate to puzzles
            router.push('/(tabs)/categories');
          }}
        >
          <Text style={styles.buttonText}>Browse Puzzles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
    padding: 20,
  },
  header: {
    marginTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.COLORS.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: theme.COLORS.greyDark,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 16,
    color: theme.COLORS.greyDark,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: theme.COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: theme.COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default HomeScreen; 