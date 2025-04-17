export const PUZZLE_CATEGORIES = [
  {
    id: 'checkmate-1',
    name: 'Checkmate in 1',
    description: 'Find the move that delivers an immediate checkmate',
    difficulty: 1,
    icon: 'king',
    backgroundColor: '#2E86AB',
  },
  {
    id: 'checkmate-2',
    name: 'Checkmate in 2',
    description: 'Find the sequence of moves that leads to checkmate in two moves',
    difficulty: 2,
    icon: 'queen',
    backgroundColor: '#A23B72',
  },
  {
    id: 'checkmate-3',
    name: 'Checkmate in 3',
    description: 'Find the sequence of moves that leads to checkmate in three moves',
    difficulty: 3,
    icon: 'bishop',
    backgroundColor: '#F18F01',
  },
  {
    id: 'tactics-pins',
    name: 'Pins & Skewers',
    description: 'Practice tactical positions involving pins and skewers',
    difficulty: 2,
    icon: 'rook',
    backgroundColor: '#4CAF50',
  },
  {
    id: 'tactics-forks',
    name: 'Forks',
    description: 'Find the best move that attacks multiple pieces at once',
    difficulty: 2,
    icon: 'knight',
    backgroundColor: '#9C27B0',
  },
  {
    id: 'endgames',
    name: 'Endgame Puzzles',
    description: 'Practice critical endgame positions and techniques',
    difficulty: 3,
    icon: 'pawn',
    backgroundColor: '#FF5722',
  },
  {
    id: 'advanced',
    name: 'Advanced Tactics',
    description: 'Complex puzzles for experienced players',
    difficulty: 4,
    icon: 'chess',
    backgroundColor: '#607D8B',
  },
];

export const getDifficultyLabel = (level) => {
  switch (level) {
    case 1: return 'Beginner';
    case 2: return 'Intermediate';
    case 3: return 'Advanced';
    case 4: return 'Expert';
    case 5: return 'Master';
    default: return 'Unknown';
  }
};

export default PUZZLE_CATEGORIES; 