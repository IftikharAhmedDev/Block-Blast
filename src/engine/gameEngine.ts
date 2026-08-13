import { Board, Piece, Position, ScoreResult } from '../types/game';
import { canPlacePiece, placePiece } from './board';
import { clearLines, findCompletedLines } from './lines';
import { calculateScore } from './scoring';

/**
 * Checks if a given piece can be placed anywhere on the board.
 */
export function hasValidMove(board: Board, piece: Piece): boolean {
  const boardSize = board.length;

  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (canPlacePiece(board, piece, { row: r, col: c })) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks if any of the remaining available pieces can be legally placed on the board.
 * Returns true if NO remaining piece can be placed.
 */
export function isGameOver(board: Board, pieces: (Piece | null)[]): boolean {
  const activePieces = pieces.filter((p): p is Piece => p !== null);
  
  if (activePieces.length === 0) {
    return false; // No pieces available, pending generation of new pieces
  }

  for (const piece of activePieces) {
    if (hasValidMove(board, piece)) {
      return false; // At least one piece can be legally placed
    }
  }

  return true; // No valid moves for any remaining piece
}

/**
 * Checks if the board contains zero occupied cells.
 */
export function checkIsBoardEmpty(board: Board): boolean {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c].occupied) {
        return false;
      }
    }
  }
  return true;
}

export interface MoveExecutionResult {
  newBoard: Board;
  scoreResult: ScoreResult;
  clearedRows: number[];
  clearedCols: number[];
  totalLinesCleared: number;
}

/**
 * Pure move execution pipeline:
 * 1. Place piece on board.
 * 2. Detect full rows/cols.
 * 3. Clear full lines.
 * 4. Check All-Clear condition.
 * 5. Calculate scores, combos & streaks.
 */
export function executeMove(
  board: Board,
  piece: Piece,
  position: Position,
  currentCombo: number,
  currentStreak: number
): MoveExecutionResult {
  // 1. Place piece
  const boardAfterPlacement = placePiece(board, piece, position);

  // 2. Detect lines
  const { rows, cols, totalLines } = findCompletedLines(boardAfterPlacement);

  // 3. Clear lines
  const boardAfterClear = clearLines(boardAfterPlacement, { rows, cols });

  // 4. Check empty board
  const isBoardEmpty = checkIsBoardEmpty(boardAfterClear);

  // 5. Calculate score
  const scoreResult = calculateScore(
    piece,
    totalLines,
    currentCombo,
    currentStreak,
    isBoardEmpty
  );

  return {
    newBoard: boardAfterClear,
    scoreResult,
    clearedRows: rows,
    clearedCols: cols,
    totalLinesCleared: totalLines,
  };
}
