import { Board, Cell, Piece, Position } from '../types/game';
import { createBoard } from './board';

function createEmptyCell(): Cell {
  return {
    occupied: false,
    color: null,
    pieceId: null,
  };
}

export interface CompletedLines {

  rows: number[];
  cols: number[];
  totalLines: number;
}

/**
 * Finds all indices of fully occupied rows.
 */
export function findCompletedRows(board: Board): number[] {
  const completedRows: number[] = [];
  const size = board.length;

  for (let r = 0; r < size; r++) {
    let isFull = true;
    for (let c = 0; c < size; c++) {
      if (!board[r][c].occupied) {
        isFull = false;
        break;
      }
    }
    if (isFull) {
      completedRows.push(r);
    }
  }

  return completedRows;
}

/**
 * Finds all indices of fully occupied columns.
 */
export function findCompletedColumns(board: Board): number[] {
  const completedCols: number[] = [];
  const size = board.length;

  for (let c = 0; c < size; c++) {
    let isFull = true;
    for (let r = 0; r < size; r++) {
      if (!board[r][c].occupied) {
        isFull = false;
        break;
      }
    }
    if (isFull) {
      completedCols.push(c);
    }
  }

  return completedCols;
}

/**
 * Finds all completed rows and columns simultaneously.
 */
export function findCompletedLines(board: Board): CompletedLines {
  const rows = findCompletedRows(board);
  const cols = findCompletedColumns(board);

  return {
    rows,
    cols,
    totalLines: rows.length + cols.length,
  };
}

/**
 * Clears all specified rows and columns from the board, returning a new Board instance.
 */
export function clearLines(
  board: Board,
  lines: { rows: number[]; cols: number[] }
): Board {
  if (lines.rows.length === 0 && lines.cols.length === 0) {
    return createBoard(board);
  }

  const newBoard = createBoard(board);
  const size = board.length;

  // Clear rows
  for (const r of lines.rows) {
    for (let c = 0; c < size; c++) {
      newBoard[r][c] = createEmptyCell();
    }
  }

  // Clear columns
  for (const c of lines.cols) {
    for (let r = 0; r < size; r++) {
      newBoard[r][c] = createEmptyCell();
    }
  }

  return newBoard;
}

/**
 * Predicts which rows and columns would be completed if the given piece were placed at position.
 * Returns empty arrays if placement is not legal.
 */
export function getPreviewCompletedLines(
  board: Board,
  piece: Piece,
  position: Position
): { rows: number[]; cols: number[] } {
  const boardSize = board.length;
  const shape = piece.shape;

  // Boundary and overlap check first
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] === 1) {
        const br = position.row + r;
        const bc = position.col + c;
        if (br < 0 || br >= boardSize || bc < 0 || bc >= boardSize) {
          return { rows: [], cols: [] };
        }
        if (board[br][bc].occupied) {
          return { rows: [], cols: [] };
        }
      }
    }
  }

  // Set of cells that will be occupied by the preview piece
  const pieceCells = new Set<string>();
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] === 1) {
        pieceCells.add(`${position.row + r},${position.col + c}`);
      }
    }
  }

  const rows: number[] = [];
  const cols: number[] = [];

  // Check which rows would be completely filled
  for (let r = 0; r < boardSize; r++) {
    let isFull = true;
    for (let c = 0; c < boardSize; c++) {
      if (!board[r][c].occupied && !pieceCells.has(`${r},${c}`)) {
        isFull = false;
        break;
      }
    }
    if (isFull) {
      rows.push(r);
    }
  }

  // Check which columns would be completely filled
  for (let c = 0; c < boardSize; c++) {
    let isFull = true;
    for (let r = 0; r < boardSize; r++) {
      if (!board[r][c].occupied && !pieceCells.has(`${r},${c}`)) {
        isFull = false;
        break;
      }
    }
    if (isFull) {
      cols.push(c);
    }
  }

  return { rows, cols };
}

