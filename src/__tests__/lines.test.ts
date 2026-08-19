import { describe, it, expect } from 'vitest';
import { createEmptyBoard } from '../engine/board';
import {
  findCompletedRows,
  findCompletedColumns,
  findCompletedLines,
  clearLines,
  getPreviewCompletedLines,
} from '../engine/lines';

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

  it('predicts line completion accurately during drag preview', () => {
    const board = createEmptyBoard();


    // Fill row 0 except the last cell (0, 7)
    for (let c = 0; c < 7; c++) {
      board[0][c] = { occupied: true, color: '#38BDF8' };
    }

    const dotPiece = {
      id: 'test_dot',
      shape: [[1]],
      color: '#38BDF8',
      width: 1,
      height: 1,
      blockCount: 1,
    };

    // When hovering over the missing cell (0, 7) -> predicts row 0 completion
    const preview1 = getPreviewCompletedLines(board, dotPiece, { row: 0, col: 7 });
    expect(preview1.rows).toEqual([0]);
    expect(preview1.cols).toEqual([]);

    // When moving away to (1, 7) -> no longer completes row 0, returns empty
    const preview2 = getPreviewCompletedLines(board, dotPiece, { row: 1, col: 7 });
    expect(preview2.rows).toEqual([]);
    expect(preview2.cols).toEqual([]);

    // When placement is invalid (overlapping an occupied cell at 0, 0) -> returns empty
    const preview3 = getPreviewCompletedLines(board, dotPiece, { row: 0, col: 0 });
    expect(preview3.rows).toEqual([]);
    expect(preview3.cols).toEqual([]);
  });
});
