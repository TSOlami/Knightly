import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import {
  getCurrentUser,
  updatePreferences,
  updateSolvedPuzzle,
  convertGuestUser
} from '../controllers/userController.js';

const router = express.Router();

// Get current user
router.get('/me', authenticateJWT, getCurrentUser);

// Update user preferences
router.patch('/preferences', authenticateJWT, updatePreferences);

// Update solved puzzle
router.post('/solved-puzzle', authenticateJWT, updateSolvedPuzzle);

// Convert guest to regular user
router.post('/convert-guest', authenticateJWT, convertGuestUser);

export default router; 