import { Chess } from 'chess.js';

/**
 * Create a new chess instance from a FEN string
 * @param {string} fen - The FEN string representing the board position
 * @returns {Chess} - A chess.js instance
 */
export const createChessFromFEN = (fen) => {
  try {
    return new Chess(fen);
  } catch (error) {
    console.error('Invalid FEN string:', fen, error);
    return new Chess(); // Return default position if FEN is invalid
  }
};

/**
 * Check if a move is valid in the given position
 * @param {Chess} chess - Chess.js instance
 * @param {string} from - Starting square (e.g., 'e2')
 * @param {string} to - Target square (e.g., 'e4')
 * @returns {boolean} - Whether the move is valid
 */
export const isValidMove = (chess, from, to) => {
  try {
    // Get the piece at the 'from' position
    const piece = chess.get(from);
    if (!piece) return false;
    
    // Check if this is a valid move
    const moves = chess.moves({ square: from, verbose: true });
    return moves.some(move => move.to === to);
  } catch (error) {
    console.error('Error checking move validity:', error);
    return false;
  }
};

/**
 * Make a move on the chess board
 * @param {Chess} chess - Chess.js instance
 * @param {string} from - Starting square
 * @param {string} to - Target square
 * @param {string} promotion - Piece to promote to if applicable (q, r, b, n)
 * @returns {object|null} - The move object if successful, null if invalid
 */
export const makeMove = (chess, from, to, promotion = 'q') => {
  try {
    const move = chess.move({
      from,
      to,
      promotion,
    });
    return move;
  } catch (error) {
    console.error('Invalid move:', from, to, error);
    return null;
  }
};

/**
 * Check if the current position is checkmate
 * @param {Chess} chess - Chess.js instance
 * @returns {boolean} - Whether the position is checkmate
 */
export const isCheckmate = (chess) => {
  return chess.isCheckmate();
};

/**
 * Check if the current position is a draw
 * @param {Chess} chess - Chess.js instance
 * @returns {boolean} - Whether the position is a draw
 */
export const isDraw = (chess) => {
  return chess.isDraw();
};

/**
 * Get piece symbol for display
 * @param {object} piece - The piece object from chess.js
 * @returns {string} - Unicode symbol for the piece
 */
export const getPieceSymbol = (piece) => {
  if (!piece) return '';
  
  const symbols = {
    'w': {
      'p': '♙', 'n': '♘', 'b': '♗', 'r': '♖', 'q': '♕', 'k': '♔'
    },
    'b': {
      'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚'
    }
  };
  
  return symbols[piece.color][piece.type];
};

/**
 * Verify if the player's move sequence matches the solution
 * @param {Chess} initialPosition - Chess.js instance with initial position
 * @param {Array<string>} solution - Array of moves in algebraic notation
 * @param {Array<object>} playerMoves - Array of move objects made by the player
 * @returns {boolean} - Whether the player's sequence matches the solution
 */
export const verifySolution = (initialPosition, solution, playerMoves) => {
  // For checkmate in one puzzles, we can simply check if the move results in checkmate
  if (solution.length === 1 && playerMoves.length === 1) {
    const moveStr = playerMoves[0].san;
    return moveStr === solution[0] || (moveStr.replace('#', '+') === solution[0]);
  }
  
  // For more complex puzzles, we need to check if the sequence matches
  // Note: This is a simplified implementation. For a real app, you'd handle opponent responses.
  const chess = new Chess(initialPosition.fen());
  for (let i = 0; i < solution.length; i++) {
    if (i >= playerMoves.length) return false;
    
    const expectedMove = solution[i];
    const playerMove = playerMoves[i].san;
    
    // Allow for minor variations (e.g., with or without check/mate symbols)
    const normalizedExpected = expectedMove.replace(/[+#]/g, '');
    const normalizedPlayer = playerMove.replace(/[+#]/g, '');
    
    if (normalizedExpected !== normalizedPlayer) {
      return false;
    }
    
    // Make the move to continue the sequence
    chess.move(playerMove);
  }
  
  return true;
};

/**
 * Get all possible moves for a piece at a given square
 * @param {Chess} chess - Chess.js instance
 * @param {string} square - The square (e.g., 'e2')
 * @returns {Array} - Array of possible moves
 */
export const getPossibleMoves = (chess, square) => {
  try {
    return chess.moves({ square, verbose: true });
  } catch (error) {
    console.error('Error getting possible moves:', error);
    return [];
  }
};

/**
 * Convert a move in algebraic notation to move coordinates
 * @param {Chess} chess - Chess.js instance
 * @param {string} move - Move in algebraic notation (e.g., 'e4')
 * @returns {Object|null} - Object with from and to coordinates, or null if invalid
 */
export const convertAlgebraicToCoords = (chess, move) => {
  try {
    const moves = chess.moves({ verbose: true });
    const moveObj = moves.find(m => m.san === move);
    return moveObj ? { from: moveObj.from, to: moveObj.to } : null;
  } catch (error) {
    console.error('Error converting algebraic notation:', error);
    return null;
  }
};

/**
 * Get a hint for the current puzzle
 * @param {Chess} chess - Chess.js instance
 * @param {Array<string>} solution - Array of solution moves
 * @returns {Object|null} - Hint object with from/to, or null if no hint available
 */
export const getHint = (chess, solution) => {
  if (!solution || solution.length === 0) return null;
  
  try {
    const nextMove = solution[0];
    return convertAlgebraicToCoords(chess, nextMove);
  } catch (error) {
    console.error('Error getting hint:', error);
    return null;
  }
}; 