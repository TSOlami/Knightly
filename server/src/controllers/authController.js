import passport from 'passport';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user with the same email exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email 
          ? 'Email is already in use' 
          : 'Username is already in use' 
      });
    }
    
    // Create new user
    const newUser = new User({
      username,
      email,
      password,
    });
    
    await newUser.save();
    
    // Generate token
    const token = generateToken(newUser);
    
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        puzzlesSolved: newUser.puzzlesSolved,
        puzzleRating: newUser.puzzleRating,
        streak: newUser.streak,
        preferences: newUser.preferences,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login with email and password
export const login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    
    // Generate token
    const token = generateToken(user);
    
    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        puzzlesSolved: user.puzzlesSolved,
        puzzleRating: user.puzzleRating,
        streak: user.streak,
        preferences: user.preferences,
      },
    });
  })(req, res, next);
};

// Login as guest
export const guestLogin = async (req, res) => {
  try {
    // Create a unique guest username
    const username = `guest_${uuidv4().substring(0, 8)}`;
    
    // Create new guest user
    const guestUser = new User({
      username,
      isGuest: true,
    });
    
    await guestUser.save();
    
    // Generate token
    const token = generateToken(guestUser);
    
    res.status(201).json({
      token,
      user: {
        id: guestUser._id,
        username: guestUser.username,
        isGuest: true,
        puzzlesSolved: guestUser.puzzlesSolved,
        puzzleRating: guestUser.puzzleRating,
        streak: guestUser.streak,
        preferences: guestUser.preferences,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Google OAuth callback
export const googleCallback = (req, res) => {
  const token = generateToken(req.user);
  
  // Redirect to app with token
  res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
}; 