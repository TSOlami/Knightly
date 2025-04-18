import mongoose from 'mongoose';

const puzzleSchema = new mongoose.Schema(
  {
    puzzleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fen: {
      type: String,
      required: true,
    },
    moves: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    ratingDeviation: {
      type: Number,
    },
    popularity: {
      type: Number,
      default: 0,
    },
    nbPlays: {
      type: Number,
      default: 0,
    },
    themes: {
      type: [String],
      default: [],
    },
    gameUrl: {
      type: String,
    },
    openingTags: {
      type: [String],
      default: [],
    },
    // Cached data for performance and filtering
    difficulty: {
      type: String,
      enum: ['beginner', 'easy', 'medium', 'hard', 'expert'],
    },
    numMoves: {
      type: Number,
    },
  },
  { timestamps: true }
);

// Create indexes for better query performance
puzzleSchema.index({ rating: 1 });
puzzleSchema.index({ themes: 1 });
puzzleSchema.index({ openingTags: 1 });
puzzleSchema.index({ difficulty: 1 });
puzzleSchema.index({ numMoves: 1 });

const Puzzle = mongoose.model('Puzzle', puzzleSchema);

export default Puzzle; 