import { Board, Cell, Piece, Position } from '../types/game';
import { GAME_CONFIG } from '../config/gameConfig';

/**
 * Creates a clean empty board filled with unoccupied cells.
 */
export function createEmptyBoard(size: number = GAME_CONFIG.BOARD_SIZE): Board {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, (): Cell => ({
      occupied: false,
      color: null,
      pieceId: null,
    }))
  );
}

/**
 * Creates a deep copy of an existing board.
 */
export function createBoard(cells?: Board): Board {
  if (!cells) {
    return createEmptyBoard();
  }
  return cells.map((row) => row.map((cell) => ({ ...cell })));
}

/**
 * Checks if a piece can be placed at the given top-left board position.
 * Returns false if out of bounds or overlapping an occupied cell.
 */
export function canPlacePiece(
  board: Board,
  piece: Piece,
  position: Position
): boolean {
  const boardSize = board.length;
  const shape = piece.shape;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] === 1) {
        const boardRow = position.row + r;
        const boardCol = position.col + c;

        // Check boundaries
        if (
          boardRow < 0 ||
          boardRow >= boardSize ||
          boardCol < 0 ||
          boardCol >= boardSize
        ) {
          return false;
        }

        // Check overlap
        if (board[boardRow][boardCol].occupied) {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * Places a piece on the board at the given position and returns a new board instance.
 * Throws an Error if placement is invalid.
 */
export function placePiece(
  board: Board,
  piece: Piece,
  position: Position
): Board {
  if (!canPlacePiece(board, piece, position)) {
    throw new Error(`Cannot place piece ${piece.id} at (${position.row}, ${position.col})`);
  }

  const newBoard = createBoard(board);
  const shape = piece.shape;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] === 1) {
        const boardRow = position.row + r;
        const boardCol = position.col + c;

        newBoard[boardRow][boardCol] = {
          occupied: true,
          color: piece.color,
          pieceId: piece.id,
        };
      }
    }
  }

  return newBoard;
}
