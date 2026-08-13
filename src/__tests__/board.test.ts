import { describe, it, expect } from 'vitest';
import { createEmptyBoard, canPlacePiece, placePiece } from '../engine/board';
import { createPieceFromShape } from '../engine/pieceGenerator';

describe('Board Pure Engine', () => {
  it('creates an empty 8x8 board', () => {
    const board = createEmptyBoard();
    expect(board.length).toBe(8);
    expect(board[0].length).toBe(8);
    expect(board.every((row) => row.every((cell) => !cell.occupied && cell.color === null))).toBe(true);
  });

  it('allows valid placement of a piece on empty board', () => {
    const board = createEmptyBoard();
    const piece = createPieceFromShape(
      { name: 'square2', shape: [[1, 1], [1, 1]], weight: 1 },
      '#6366F1'
    );

    expect(canPlacePiece(board, piece, { row: 0, col: 0 })).toBe(true);
    expect(canPlacePiece(board, piece, { row: 6, col: 6 })).toBe(true);
  });

  it('rejects placement extending outside board boundaries', () => {
    const board = createEmptyBoard();
    const piece = createPieceFromShape(
      { name: 'h3', shape: [[1, 1, 1]], weight: 1 },
      '#6366F1'
    );

    expect(canPlacePiece(board, piece, { row: 0, col: 6 })).toBe(false); // extends to col 8 (out of bounds)
    expect(canPlacePiece(board, piece, { row: 8, col: 0 })).toBe(false); // out of bounds row
    expect(canPlacePiece(board, piece, { row: -1, col: 0 })).toBe(false); // negative row
  });

  it('rejects placement overlapping occupied cells', () => {
    let board = createEmptyBoard();
    const piece1 = createPieceFromShape(
      { name: 'dot', shape: [[1]], weight: 1 },
      '#6366F1'
    );

    board = placePiece(board, piece1, { row: 2, col: 2 });
    expect(board[2][2].occupied).toBe(true);

    const piece2 = createPieceFromShape(
      { name: 'square2', shape: [[1, 1], [1, 1]], weight: 1 },
      '#10B981'
    );

    expect(canPlacePiece(board, piece2, { row: 1, col: 1 })).toBe(false); // overlaps (2,2)
    expect(canPlacePiece(board, piece2, { row: 3, col: 3 })).toBe(true); // does not overlap
  });

  it('immutably places piece without mutating previous board state', () => {
    const originalBoard = createEmptyBoard();
    const piece = createPieceFromShape(
      { name: 'h2', shape: [[1, 1]], weight: 1 },
      '#6366F1'
    );

    const newBoard = placePiece(originalBoard, piece, { row: 0, col: 0 });

    expect(originalBoard[0][0].occupied).toBe(false);
    expect(newBoard[0][0].occupied).toBe(true);
    expect(newBoard[0][1].occupied).toBe(true);
    expect(newBoard[0][0].color).toBe('#6366F1');
  });

  it('throws error when attempting invalid placement', () => {
    const board = createEmptyBoard();
    const piece = createPieceFromShape(
      { name: 'square3', shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], weight: 1 },
      '#6366F1'
    );

    expect(() => placePiece(board, piece, { row: 6, col: 6 })).toThrow();
  });
});
