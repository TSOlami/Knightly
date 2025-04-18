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
      fen: '5rk1/5ppp/7N/8/8/8/8/7K w - - 0 1',
      solution: ['Nf7#'],
      explanation: 'Knight delivers checkmate by controlling all escape squares',
    },
    {
      id: 'cm1-002',
      name: 'Queen\'s Sacrifice',
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/8/PPPPQ1PP/RNB1K1NR w KQkq - 0 1',
      solution: ['Qh5#'],
      explanation: 'Queen delivers checkmate by attacking the king with no possible defense',
    },
    {
      id: 'cm1-003',
      name: 'Back Rank Mate',
      fen: 'r5k1/pp3ppp/8/8/8/8/8/3R3K w - - 0 1',
      solution: ['Rd8#'],
      explanation: 'Rook delivers checkmate on the back rank with no escape squares',
    },
    {
      id: 'cm1-004',
      name: 'Bishop\'s Strike',
      fen: '5rk1/pp3ppp/8/2B5/8/8/P4PPP/6K1 w - - 0 1',
      solution: ['Bxf7#'],
      explanation: 'Bishop captures f7 pawn to deliver checkmate with no escape squares',
    },
    {
      id: 'cm1-005',
      name: 'Queen\'s Checkmate',
      fen: 'r1b1kb1r/pppp1ppp/8/4n3/3n4/3B4/PPPQ1PPP/R3KBNR w KQkq - 0 1',
      solution: ['Qxd4#'],
      explanation: 'Queen captures knight, delivering checkmate with no escape',
    },
    {
      id: 'cm1-006',
      name: 'Smothered Mate',
      fen: 'r1bqkb1r/ppp2Npp/2n5/3np3/2B5/8/PPPP1PPP/RNBQK2R w KQkq - 0 1',
      solution: ['Ne6#'],
      explanation: 'Knight delivers checkmate while the king is surrounded by his own pieces',
    },
    {
      id: 'cm1-007',
      name: 'Queen\'s Diagonal',
      fen: 'r1b1k2r/pppp1ppp/2n2n2/2b1p1q1/2B1P3/2NP1N2/PPP2PPP/R1BQK2R b KQkq - 0 1',
      solution: ['Qh4#'],
      explanation: 'Queen delivers checkmate along the diagonal with no possible defense',
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
      solution: ['Bxf7+', 'Kxf7', 'Ne5#'],
      explanation: 'Bishop sacrifice forces king to move, allowing knight to deliver checkmate',
    },
    {
      id: 'cm2-003',
      name: 'Double Rook Mate',
      fen: '6k1/5ppp/8/8/8/8/2R3PP/2R3K1 w - - 0 1',
      solution: ['Rc8+', 'Kh7', 'Rh8#'],
      explanation: 'Rook check drives king to h-file, setting up checkmate with second rook',
    },
    {
      id: 'cm2-004',
      name: 'Queen\'s Trap',
      fen: '3r2k1/p4ppp/1p6/2p5/2P1P3/1P3Q2/P4PPP/6K1 w - - 0 1',
      solution: ['Qf6', 'Kh8', 'Qxf7#'],
      explanation: 'Queen creates a mating threat, leading to checkmate on the next move',
    },
    {
      id: 'cm2-005',
      name: 'Bishop and Knight Mate',
      fen: '6k1/pp3ppp/8/3B4/8/8/PPP2PPP/2K1N3 w - - 0 1',
      solution: ['Ne5', 'Kh8', 'Nf7#'],
      explanation: 'Knight moves to prepare the checkmate, limiting king\'s escape squares',
    },
  ],
  
  // Checkmate in 3 puzzles
  'checkmate-3': [
    {
      id: 'cm3-001',
      name: 'Queen\'s Gambit',
      fen: '3r2k1/pp3ppp/8/8/6Q1/8/PPP2PPP/6K1 w - - 0 1',
      solution: ['Qg7+', 'Kxg7', 'Rf7+', 'Kg8', 'Rf8#'],
      explanation: 'Queen sacrifice forces king to move, setting up a rook mate in two more moves',
    },
    {
      id: 'cm3-002',
      name: 'Knight\'s Tour',
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
      solution: ['Ng5', 'd6', 'Nxf7', 'Kxf7', 'Qf3+', 'Ke8', 'Qf7#'],
      explanation: 'Knight attack leads to a forced sequence ending in queen checkmate',
    },
    {
      id: 'cm3-003',
      name: 'Rook and Knight Mate',
      fen: '4r1k1/ppp2ppp/8/8/8/8/PPP1NPPP/2KR4 w - - 0 1',
      solution: ['Nd4', 'Re7', 'Rxe7', 'Kh8', 'Rh7#'],
      explanation: 'Knight moves to control key squares, followed by rook tactics to deliver mate',
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
    {
      id: 'pin-003',
      name: 'Knight & Bishop Pin',
      fen: 'rnbqkb1r/ppp2ppp/5n2/3pp3/3P4/2N2N2/PPP1PPPP/R1BQKB1R w KQkq - 0 1',
      solution: ['Nxe5', 'Qd6', 'Nxf7'],
      explanation: 'Knight creates a pin and captures material after queen moves to defend',
    },
  ],
  
  // Forks tactical puzzles
  'tactics-forks': [
    {
      id: 'fork-001',
      name: 'Knight Fork',
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
      solution: ['Ng5', 'd6', 'Nxf7', 'Kxf7', 'Bxd6+'],
      explanation: 'Knight fork attacks king and queen simultaneously',
    },
    {
      id: 'fork-002',
      name: 'Pawn Fork',
      fen: 'r1bqkbnr/ppp2ppp/2n5/3pp3/8/2N2NP1/PPPPPP1P/R1BQK2R w KQkq - 0 1',
      solution: ['d4', 'exd4', 'e4'],
      explanation: 'Pawn fork attacks knight and bishop',
    },
    {
      id: 'fork-003',
      name: 'Queen Fork',
      fen: 'r3k2r/ppp2ppp/2n1b3/3q4/3P4/2NBQ3/PPP2PPP/R3K2R b KQkq - 0 1',
      solution: ['Qh1+', 'Ke2', 'Qxa1'],
      explanation: 'Queen check creates a fork between king and rook',
    },
  ],
  
  // Endgame puzzles
  'endgames': [
    {
      id: 'end-001',
      name: 'Pawn Promotion',
      fen: '8/P7/8/8/8/k7/8/K7 w - - 0 1',
      solution: ['a8=Q', 'Ka4', 'Qa2#'],
      explanation: 'Pawn promotion to queen leads to checkmate',
    },
    {
      id: 'end-002',
      name: 'King and Rook',
      fen: '8/8/8/8/8/k7/4R3/K7 w - - 0 1',
      solution: ['Re3+', 'Ka4', 'Ra3#'],
      explanation: 'Rook delivers checkmate with king\'s support',
    },
    {
      id: 'end-003',
      name: 'Queen vs Pawn',
      fen: '8/8/8/8/8/k7/p7/K1Q5 w - - 0 1',
      solution: ['Qc3+', 'Ka4', 'Qc4+', 'Ka3', 'Qc1+'],
      explanation: 'Queen uses checks to stop pawn promotion and trap the king',
    },
  ],
  
  // Advanced tactical puzzles
  'advanced': [
    {
      id: 'adv-001',
      name: 'Zugzwang',
      fen: '8/8/8/8/p7/k7/P7/K7 w - - 0 1',
      solution: ['Kb1', 'Kb3', 'Kc1', 'Kc3', 'Kd2', 'Kb2', 'Kd3'],
      explanation: 'Complex endgame where forcing opponent to move puts them at disadvantage',
    },
    {
      id: 'adv-002',
      name: 'Sacrifice for Mate',
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
      solution: ['Bxf7+', 'Kxf7', 'Ng5+', 'Kg8', 'Qf3', 'Qe7', 'Qf7+', 'Qxf7', 'Ne6#'],
      explanation: 'Complex sacrifice sequence leading to checkmate',
    },
    {
      id: 'adv-003',
      name: 'Double Bishop Sacrifice',
      fen: 'r1bqk2r/ppp2ppp/2n5/3np3/2BP4/5N2/PPP2PPP/RNBQ1RK1 w - - 0 1',
      solution: ['Bxe5', 'Nxe5', 'Re1', 'Be7', 'Rxe5', 'Bxe5', 'Qe2'],
      explanation: 'Two sacrifices to gain a strong position and material advantage',
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