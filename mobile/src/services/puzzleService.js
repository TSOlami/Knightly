import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// API base URL from environment variables
let API_URL = process.env.EXPO_PUBLIC_API_URL;
if (!API_URL) {
  if (Platform.OS === 'android' && !__DEV__) {
    // Use actual IP address when running on physical devices
    API_URL = 'http://your-computer-ip:5000/api';
  } else if (Platform.OS === 'android') {
    API_URL = 'http://10.0.2.2:5000/api';
  } else {
    API_URL = 'http://localhost:5000/api';
  }
}

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Puzzle service functions
const puzzleService = {
  // Get paginated puzzles with filters
  getPuzzles: async (page = 1, limit = 20, filters = {}) => {
    try {
      const { theme, difficulty, rating_min, rating_max, ordering } = filters;
      
      // Build query string
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      if (theme) queryParams.append('theme', theme);
      if (difficulty) queryParams.append('difficulty', difficulty);
      if (rating_min) queryParams.append('rating_min', rating_min);
      if (rating_max) queryParams.append('rating_max', rating_max);
      if (ordering) queryParams.append('ordering', ordering);
      
      const response = await api.get(`/puzzles?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching puzzles:', error);
      throw error.response?.data?.message || 'Failed to fetch puzzles';
    }
  },
  
  // Get a specific puzzle by ID
  getPuzzleById: async (puzzleId) => {
    try {
      const response = await api.get(`/puzzles/${puzzleId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching puzzle:', error);
      throw error.response?.data?.message || 'Failed to fetch puzzle';
    }
  },
  
  // Get puzzle themes (categories)
  getThemes: async () => {
    try {
      const response = await api.get('/puzzles/categories/themes');
      return response.data;
    } catch (error) {
      console.error('Error fetching themes:', error);
      throw error.response?.data?.message || 'Failed to fetch themes';
    }
  },
  
  // Get puzzle openings
  getOpenings: async () => {
    try {
      const response = await api.get('/puzzles/categories/openings');
      return response.data;
    } catch (error) {
      console.error('Error fetching openings:', error);
      throw error.response?.data?.message || 'Failed to fetch openings';
    }
  },
  
  // Get puzzle statistics
  getStats: async () => {
    try {
      const response = await api.get('/puzzles/stats/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error.response?.data?.message || 'Failed to fetch stats';
    }
  },
  
  // Mark puzzle as solved
  markAsSolved: async (puzzleId, attempts, timeToSolve) => {
    try {
      const response = await api.post('/users/solved-puzzle', {
        puzzleId,
        attempts,
        timeToSolve,
      });
      return response.data;
    } catch (error) {
      console.error('Error marking puzzle as solved:', error);
      throw error.response?.data?.message || 'Failed to mark puzzle as solved';
    }
  },
  
  // Helper function to convert puzzle format from API to the format used by the app
  formatPuzzle: (apiPuzzle) => {
    return {
      id: apiPuzzle.puzzleId,
      name: `Puzzle ${apiPuzzle.puzzleId}`,
      fen: apiPuzzle.fen,
      solution: apiPuzzle.moves.split(' '),
      difficulty: apiPuzzle.difficulty,
      rating: apiPuzzle.rating,
      themes: apiPuzzle.themes,
      popularity: apiPuzzle.popularity,
      nbPlays: apiPuzzle.nbPlays,
      gameUrl: apiPuzzle.gameUrl,
      opening: apiPuzzle.openingTags.join(', '),
    };
  },
  
  // Helper to categorize puzzles by difficulty
  getPuzzlesByDifficulty: async (limit = 5) => {
    try {
      // Fetch puzzles for each difficulty level
      const difficulties = ['beginner', 'easy', 'medium', 'hard', 'expert'];
      const puzzlesByDifficulty = {};
      
      for (const difficulty of difficulties) {
        const response = await puzzleService.getPuzzles(1, limit, { difficulty });
        puzzlesByDifficulty[difficulty] = response.puzzles.map(puzzleService.formatPuzzle);
      }
      
      return puzzlesByDifficulty;
    } catch (error) {
      console.error('Error fetching puzzles by difficulty:', error);
      throw error;
    }
  },
  
  // Helper to get puzzles by theme
  getPuzzlesByTheme: async (theme, limit = 10) => {
    try {
      const response = await puzzleService.getPuzzles(1, limit, { theme });
      return response.puzzles.map(puzzleService.formatPuzzle);
    } catch (error) {
      console.error(`Error fetching puzzles for theme ${theme}:`, error);
      throw error;
    }
  },
};

export default puzzleService; 