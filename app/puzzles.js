// puzzles.js - Collection of chess puzzles organized by categories and difficulty

// Define puzzle types
export const PUZZLE_TYPES = {
  CHECKMATE: 'checkmate',
  BEST_MOVE: 'best-move',
  TACTICAL: 'tactical',
  ENDGAME: 'endgame',
  OPENING: 'opening',
};

// Define puzzle categories
export const CATEGORIES = [
  {
    id: 'checkmate-in-1',
    name: 'Checkmate in 1',
    description: 'Find the checkmate in one move',
    type: PUZZLE_TYPES.CHECKMATE,
    movesToSolve: 1,
    difficulty: 1,
    icon: 'chess-queen',
    color: '#E63946',
  },
  {
    id: 'checkmate-in-2',
    name: 'Checkmate in 2',
    description: 'Find the sequence leading to checkmate in two moves',
    type: PUZZLE_TYPES.CHECKMATE,
    movesToSolve: 2,
    difficulty: 2,
    icon: 'chess-knight',
    color: '#F1C40F',
  },
  {
    id: 'checkmate-in-3',
    name: 'Checkmate in 3',
    description: 'Find the sequence leading to checkmate in three moves',
    type: PUZZLE_TYPES.CHECKMATE,
    movesToSolve: 3,
    difficulty: 3,
    icon: 'chess-rook',
    color: '#27AE60',
  },
  {
    id: 'tactics',
    name: 'Tactical Puzzles',
    description: 'Find the best tactical move to gain an advantage',
    type: PUZZLE_TYPES.BEST_MOVE,
    movesToSolve: null, // variable
    difficulty: 2,
    icon: 'chess-bishop',
    color: '#3498DB',
  },
  {
    id: 'endgames',
    name: 'Endgame Studies',
    description: 'Practice critical endgame positions',
    type: PUZZLE_TYPES.ENDGAME,
    movesToSolve: null, // variable
    difficulty: 3,
    icon: 'chess-king',
    color: '#9B59B6',
  },
];

// All puzzles organized by category
export const puzzlesByCategory = {
  'checkmate-in-1': [
    {
      id: 1,
      name: "Queen's Gambit",
      fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1",
      hint: "Look for the queen's power",
      difficulty: 1,
      solution: "Qxf7#" // Chess notation for the winning move
    },
    {
      id: 2,
      name: "Knight's Revenge",
      fen: "r1bqkbnr/ppp2ppp/2np4/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1",
      hint: "The bishop can deliver a deadly blow",
      difficulty: 1,
      solution: "Bxf7#"
    },
    {
      id: 3,
      name: "Rook's Corridor",
      fen: "5rk1/pp2ppbp/3p2p1/8/3P4/1P4P1/P1Q1PPKP/5R2 w - - 0 1",
      hint: "The rook has a clear path",
      difficulty: 1,
      solution: "Rf8#"
    },
    {
      id: 4,
      name: "Bishop's Sacrifice",
      fen: "r2qk2r/ppp1bppp/2np1n2/4p3/2B1P1b1/2NP1N2/PPP2PPP/R1BQ1RK1 w kq - 0 1",
      hint: "Sometimes giving up material leads to checkmate",
      difficulty: 1,
      solution: "Bxf7#"
    },
    {
      id: 5,
      name: "Pawn Promotion",
      fen: "8/3P3k/n2K4/8/8/8/8/8 w - - 0 1",
      hint: "A pawn can become more powerful",
      difficulty: 1,
      solution: "d8=Q#"
    },
    {
      id: 6,
      name: "Queen's Sacrifice",
      fen: "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1",
      hint: "Sometimes the queen must be sacrificed",
      difficulty: 1,
      solution: "Qxe8#"
    },
    {
      id: 7,
      name: "Double Check",
      fen: "rnb1kb1r/pp3ppp/2p1pn2/q7/3P4/2N2N2/PPP1BPPP/R1BQK2R w KQkq - 0 1",
      hint: "Look for a move that gives check with two pieces",
      difficulty: 1,
      solution: "Bb5#"
    },
    {
      id: 8,
      name: "Back Rank Mate",
      fen: "r4rk1/ppp2ppp/8/8/8/8/PPP1QPPP/2KR4 w - - 0 1",
      hint: "The back rank is vulnerable",
      difficulty: 1,
      solution: "Qe8#"
    }
  ],
  'checkmate-in-2': [
    {
      id: 101,
      name: "Double Attack",
      fen: "r1b1kb1r/pppp1ppp/2n2n2/4p2q/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1",
      hint: "Create a double threat with your queen",
      difficulty: 2,
      solution: ["Bxf7+", "Ke7", "Qc5#"], // Sequence of moves
      expectedResponses: ["Ke7"], // Expected opponent responses
    },
    {
      id: 102,
      name: "Knight's Tour",
      fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
      hint: "The knight and bishop can coordinate brilliantly",
      difficulty: 2,
      solution: ["Ng5", "fxg5", "Bxf7#"],
      expectedResponses: ["fxg5"],
    },
  ],
  'tactics': [
    {
      id: 201,
      name: "Fork in the Road",
      fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
      hint: "Find the knight fork",
      difficulty: 2,
      solution: ["Ng5", "d6", "Nxf7"],
      expectedResponses: ["d6"],
      evaluation: "+3.5", // Material advantage after the sequence
    },
  ],
};

// Helper function to get all puzzles as a flat array
export const getAllPuzzles = () => {
  return Object.values(puzzlesByCategory).flat();
};

// Helper function to get puzzles by specific category
export const getPuzzlesByCategory = (categoryId) => {
  return puzzlesByCategory[categoryId] || [];
};

// Backward compatibility for existing code that uses the "puzzles" export
export const puzzles = puzzlesByCategory['checkmate-in-1'];