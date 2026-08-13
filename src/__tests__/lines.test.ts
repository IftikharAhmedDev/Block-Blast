import { describe, it, expect } from 'vitest';
import { createEmptyBoard } from '../engine/board';
import { findCompletedRows, findCompletedColumns, findCompletedLines, clearLines } from '../engine/lines';

describe('Lines Pure Engine', () => {
  it('detects a completed row', () => {
    const board = createEmptyBoard();
    // Fill row 3
    for (let c = 0; c < 8; c++) {
      board[3][c] = { occupied: true, color: '#6366F1' };
    }

    const rows = findCompletedRows(board);
    expect(rows).toEqual([3]);
  });

  it('detects a completed column', () => {
    const board = createEmptyBoard();
    // Fill column 5
    for (let r = 0; r < 8; r++) {
      board[r][5] = { occupied: true, color: '#10B981' };
    }

    const cols = findCompletedColumns(board);
    expect(cols).toEqual([5]);
  });

  it('detects simultaneous multiple rows and columns clearing (cross clear)', () => {
    const board = createEmptyBoard();

    // Fill row 2 and row 4
    for (let c = 0; c < 8; c++) {
      board[2][c] = { occupied: true, color: '#6366F1' };
      board[4][c] = { occupied: true, color: '#6366F1' };
    }

    // Fill column 1
    for (let r = 0; r < 8; r++) {
      board[r][1] = { occupied: true, color: '#EC4899' };
    }

    const completed = findCompletedLines(board);
    expect(completed.rows).toEqual([2, 4]);
    expect(completed.cols).toEqual([1]);
    expect(completed.totalLines).toBe(3);
  });

  it('clears completed rows and columns correctly', () => {
    const board = createEmptyBoard();

    // Fill row 0
    for (let c = 0; c < 8; c++) {
      board[0][c] = { occupied: true, color: '#6366F1' };
    }

    const clearedBoard = clearLines(board, { rows: [0], cols: [] });

    expect(clearedBoard[0].every((cell) => !cell.occupied)).toBe(true);
  });
});
