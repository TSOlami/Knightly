import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    email: {
      type: String,
      required: function() {
        return !this.isGuest;
      },
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: function() {
        return !this.googleId && !this.isGuest;
      },
      minlength: [6, 'Password must be at least 6 characters'],
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    puzzlesSolved: {
      type: Number,
      default: 0,
    },
    puzzleRating: {
      type: Number,
      default: 1200,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    solvedPuzzles: [{
      puzzleId: String,
      solvedAt: Date,
      attempts: Number,
      timeToSolve: Number, // in seconds
    }],
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      pieceStyle: {
        type: String,
        default: 'standard',
      },
      boardTheme: {
        type: String,
        default: 'wooden',
      },
      sound: {
        type: Boolean,
        default: true,
      },
      hapticFeedback: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isGuest) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User; 