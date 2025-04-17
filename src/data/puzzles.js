// Here we define our puzzles organized by category
// Each puzzle contains:
// - id: unique identifier
// - name: display name for the puzzle
// - fen: FEN string representing the chess position
// - solution: array of moves in algebraic notation that solve the puzzle
// - explanation: optional text explaining the solution
// - categoryId: references the category this puzzle belongs to

const puzzleData = {
  // Checkmate in 1 puzzles
  'checkmate-1': [
    {
      id: 'cm1-001',
      name: 'Corner Trap',
      fen: '5rk1/5Npp/8/8/8/8/8/7K w - - 0 1',
      solution: ['Nh6#'],
      explanation: 'Knight delivers checkmate by controlling all escape squares',
    },
    {
      id: 'cm1-002',
      name: 'Queen\'s Sacrifice',
      fen: 'r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 4',
      solution: ['Qxf7#'],
      explanation: 'Queen captures f7 pawn, delivering checkmate',
    },
    {
      id: 'cm1-003',
      name: 'Back Rank Mate',
      fen: '6k1/5ppp/8/8/8/8/8/R6K w - - 0 1',
      solution: ['Ra8#'],
      explanation: 'Rook delivers checkmate on the back rank',
    },
    {
      id: 'cm1-004',
      name: 'Bishop\'s Revenge',
      fen: '5rk1/pp3ppp/8/4q3/2B5/8/PP3PPP/5RK1 w - - 0 1',
      solution: ['Bxf7#'],
      explanation: 'Bishop captures f7 pawn to deliver checkmate',
    },
    {
      id: 'cm1-005',
      name: 'Queen\'s March',
      fen: 'r1b1kb1r/pppp1ppp/2n5/4q3/3n4/3B4/PPPQ1PPP/RN2KBNR w KQkq - 0 1',
      solution: ['Qxd4#'],
      explanation: 'Queen captures knight, delivering checkmate',
    },
  ],
  
  // Checkmate in 2 puzzles
  'checkmate-2': [
    {
      id: 'cm2-001',
      name: 'Arabian Mate',
      fen: '5rk1/5ppp/8/8/8/8/2R3PP/6K1 w - - 0 1',
      solution: ['Rc8+', 'Rf8', 'Rxf8#'],
      explanation: 'Rook check forces king to move, allowing checkmate next move',
    },
    {
      id: 'cm2-002',
      name: 'Queen Sacrifice',
      fen: 'r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1',
      solution: ['Qd5', 'exd5', 'Bxf7#'],
      explanation: 'Queen sacrifice forces pawn capture, allowing bishop to deliver checkmate',
    },
    {
      id: 'cm2-003',
      name: 'Double Rook Mate',
      fen: '6k1/5ppp/8/8/8/8/2R3PP/2R3K1 w - - 0 1',
      solution: ['Rc8+', 'Kh7', 'Rh8#'],
      explanation: 'Rook check drives king to h-file, setting up checkmate with second rook',
    },
  ],
  
  // Checkmate in 3 puzzles
  'checkmate-3': [
    {
      id: 'cm3-001',
      name: 'Queen\'s Gambit',
      fen: '3r2k1/pp3ppp/8/8/6Q1/8/PPP2PPP/6K1 w - - 0 1',
      solution: ['Qg7+', 'Kxg7', 'Rh7+', 'Kg8', 'Rh8#'],
      explanation: 'Queen sacrifice forces king to move, setting up a rook mate in two more moves',
    },
    {
      id: 'cm3-002',
      name: 'Knight\'s Tour',
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
      solution: ['Ng5', 'h6', 'Nxf7', 'Kxf7', 'Qf3+', 'Ke6', 'Qf5#'],
      explanation: 'Knight attacks f7, which is captured, then queen delivers mate in 3 moves',
    },
  ],
  
  // Pins & Skewers tactical puzzles
  'tactics-pins': [
    {
      id: 'pin-001',
      name: 'Bishop Pin',
      fen: 'r1bqkbnr/ppp2ppp/2n5/3pp3/2B5/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
      solution: ['Bxf7+', 'Ke7', 'Bb3'],
      explanation: 'Bishop pin wins material by forking king and rook',
    },
    {
      id: 'pin-002',
      name: 'Queen\'s Skewer',
      fen: 'r3k2r/ppp2ppp/2n1bn2/3qp3/3P4/2N1BN2/PPP2PPP/R2QK2R b KQkq - 0 1',
      solution: ['Qh1+', 'Ke2', 'Qxh2+'],
      explanation: 'Queen skewers king and rook, winning material',
    },
  ],
  
  // Forks tactical puzzles
  'tactics-forks': [
    {
      id: 'fork-001',
      name: 'Knight Fork',
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
      solution: ['Ng5', 'd5', 'Nxf7', 'Kxf7', 'Bxd5+'],
      explanation: 'Knight fork attacks king and queen simultaneously',
    },
    {
      id: 'fork-002',
      name: 'Pawn Fork',
      fen: 'r1bqkbnr/ppp2ppp/2n5/3pp3/8/2N2NP1/PPPPPP1P/R1BQK2R w KQkq - 0 1',
      solution: ['d4', 'exd4', 'e4'],
      explanation: 'Pawn fork attacks knight and bishop',
    },
  ],
  
  // Endgame puzzles
  'endgames': [
    {
      id: 'end-001',
      name: 'Pawn Promotion',
      fen: '8/P7/8/8/8/8/k7/K7 w - - 0 1',
      solution: ['a8=Q', 'Ka3', 'Qa2#'],
      explanation: 'Pawn promotion to queen leads to checkmate',
    },
    {
      id: 'end-002',
      name: 'King and Rook',
      fen: '8/8/8/8/8/k7/4R3/K7 w - - 0 1',
      solution: ['Re3+', 'Ka4', 'Ra3#'],
      explanation: 'Rook delivers checkmate with king\'s support',
    },
  ],
  
  // Advanced tactical puzzles
  'advanced': [
    {
      id: 'adv-001',
      name: 'Zugzwang',
      fen: '8/8/8/8/p7/k7/P7/K7 w - - 0 1',
      solution: ['Kb1', 'Kb3', 'Kc1', 'Kc3', 'Kd2', 'Kb2', 'Kd3', 'Kb3', 'Kd4', 'Kb4', 'Kd5', 'Kb5', 'Kd6', 'Kc6', 'a4', 'Kb6', 'a5+', 'Ka7', 'Kc7', 'Ka8', 'a6', 'Ka7', 'a7'],
      explanation: 'Complex endgame where forcing opponent to move puts them at disadvantage',
    },
    {
      id: 'adv-002',
      name: 'Sacrifice for Mate',
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
      solution: ['Bxf7+', 'Kxf7', 'Ng5+', 'Kg8', 'Qf3', 'Qe7', 'Qf7+', 'Qxf7', 'Ne6#'],
      explanation: 'Complex sacrifice sequence leading to checkmate',
    },
  ],
};

// Function to get all puzzles for a specific category
export const getPuzzlesByCategory = (categoryId) => {
  return puzzleData[categoryId] || [];
};

// Function to get a specific puzzle by ID
export const getPuzzleById = (puzzleId) => {
  // Flatten all puzzles into a single array
  const allPuzzles = Object.values(puzzleData).flat();
  // Find and return the puzzle with matching ID
  return allPuzzles.find(puzzle => puzzle.id === puzzleId);
};

// Function to get all puzzles
export const getAllPuzzles = () => {
  return Object.values(puzzleData).flat();
};

export default puzzleData; 