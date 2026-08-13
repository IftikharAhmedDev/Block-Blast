import { Board, Cell } from '../types/game';
import { createBoard } from './board';

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

function createEmptyCell(): Cell {
  return {
    occupied: false,
    color: null,
    pieceId: null,
  };
}
