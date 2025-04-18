import User from '../models/User.js';

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    // Update last active timestamp
    await User.findByIdAndUpdate(req.user._id, { lastActive: Date.now() });
    
    res.json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      puzzlesSolved: req.user.puzzlesSolved,
      puzzleRating: req.user.puzzleRating,
      streak: req.user.streak,
      isGuest: req.user.isGuest,
      preferences: req.user.preferences,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user preferences
export const updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    
    // Update user preferences
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { preferences },
      { new: true }
    );
    
    res.json({
      preferences: updatedUser.preferences,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update solved puzzle
export const updateSolvedPuzzle = async (req, res) => {
  try {
    const { puzzleId, attempts, timeToSolve } = req.body;
    
    // Check if puzzle exists in solved puzzles
    const existingPuzzle = req.user.solvedPuzzles.find(
      (puzzle) => puzzle.puzzleId === puzzleId
    );
    
    if (existingPuzzle) {
      // Update existing puzzle record
      existingPuzzle.solvedAt = Date.now();
      existingPuzzle.attempts += attempts;
      existingPuzzle.timeToSolve = Math.min(existingPuzzle.timeToSolve, timeToSolve);
    } else {
      // Add new puzzle to solved puzzles
      req.user.solvedPuzzles.push({
        puzzleId,
        solvedAt: Date.now(),
        attempts,
        timeToSolve,
      });
      
      // Increment puzzles solved count
      req.user.puzzlesSolved += 1;
    }
    
    // Update streak if needed
    const today = new Date();
    const lastActiveDate = new Date(req.user.lastActive);
    
    if (
      today.getDate() !== lastActiveDate.getDate() ||
      today.getMonth() !== lastActiveDate.getMonth() ||
      today.getFullYear() !== lastActiveDate.getFullYear()
    ) {
      // Check if last active was yesterday
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (
        yesterday.getDate() === lastActiveDate.getDate() &&
        yesterday.getMonth() === lastActiveDate.getMonth() &&
        yesterday.getFullYear() === lastActiveDate.getFullYear()
      ) {
        // Increment streak
        req.user.streak += 1;
      } else {
        // Reset streak
        req.user.streak = 1;
      }
    }
    
    // Update last active
    req.user.lastActive = Date.now();
    
    await req.user.save();
    
    res.json({
      puzzlesSolved: req.user.puzzlesSolved,
      streak: req.user.streak,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Convert guest to regular user
export const convertGuestUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user is guest
    if (!req.user.isGuest) {
      return res.status(400).json({ message: 'User is not a guest' });
    }
    
    // Check if username or email is already taken
    const existingUser = await User.findOne({ 
      $or: [
        { username }, 
        { email },
        { _id: { $ne: req.user._id } }
      ] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email 
          ? 'Email is already in use' 
          : 'Username is already in use' 
      });
    }
    
    // Update guest user
    req.user.username = username;
    req.user.email = email;
    req.user.password = password;
    req.user.isGuest = false;
    
    await req.user.save();
    
    res.json({
      message: 'Guest user converted successfully',
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        puzzlesSolved: req.user.puzzlesSolved,
        puzzleRating: req.user.puzzleRating,
        streak: req.user.streak,
        isGuest: req.user.isGuest,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 