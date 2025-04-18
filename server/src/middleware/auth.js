import passport from 'passport';
import jwt from 'jsonwebtoken';

// Middleware to authenticate with JWT
export const authenticateJWT = passport.authenticate('jwt', { session: false });

// Middleware that allows both authenticated and guest users
export const optionalAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (!err && user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};

// Generate JWT token
export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      username: user.username,
      isGuest: user.isGuest || false 
    },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: user.isGuest ? '24h' : '7d' }
  );
};

// Helper function to check if user has admin role
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Admin privilege required.' });
}; 