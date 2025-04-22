import express from 'express';
import { optionalAuth } from '../middleware/auth.js';
import { 
  getPuzzles, 
  getThemes, 
  getOpenings, 
  getPuzzleStats, 
  getPuzzleById,
  getNextPuzzle
} from '../controllers/puzzleController.js';

const router = express.Router();

// Get puzzles with pagination and filters
router.get('/', optionalAuth, getPuzzles);

// Get puzzle categories (themes) - MUST come before the /:puzzleId route
router.get('/categories/themes', getThemes);

// Get puzzle categories (openings) - MUST come before the /:puzzleId route
router.get('/categories/openings', getOpenings);

// Get puzzle statistics
router.get('/stats/overview', getPuzzleStats);

// Get next puzzle - MUST come before the /:puzzleId route
router.get('/next/:puzzleId', optionalAuth, getNextPuzzle);

// Get a specific puzzle by ID - MUST come after all other specific routes
router.get('/:puzzleId', optionalAuth, getPuzzleById);

export default router; 