import express from 'express';
import passport from 'passport';
import { 
  register, 
  login, 
  guestLogin, 
  googleCallback 
} from '../controllers/authController.js';

const router = express.Router();

// Register a new user
router.post('/register', register);

// Login with email and password
router.post('/login', login);

// Login as guest
router.post('/guest', guestLogin);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleCallback
);

export default router; 