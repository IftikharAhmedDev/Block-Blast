import { describe, it, expect } from 'vitest';
import { createEmptyBoard } from '../engine/board';
import { createPieceFromShape } from '../engine/pieceGenerator';
import { executeMove, hasValidMove, isGameOver } from '../engine/gameEngine';

describe('Game Engine Facade & Flow', () => {
  it('detects valid moves exist on an empty board', () => {
    const board = createEmptyBoard();
    const piece = createPieceFromShape(
      { name: 'square2', shape: [[1, 1], [1, 1]], weight: 1 },
      '#6366F1'
    );

    expect(hasValidMove(board, piece)).toBe(true);
    expect(isGameOver(board, [piece, null, null])).toBe(false);
  });

  it('detects game over when no remaining pieces fit on board', () => {
    let board = createEmptyBoard();

    // Completely fill board with blocks except one isolated 1x1 spot
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (r !== 7 || c !== 7) {
          board[r][c] = { occupied: true, color: '#6366F1' };
        }
      }
    }

    const largePiece = createPieceFromShape(
      { name: 'square2', shape: [[1, 1], [1, 1]], weight: 1 },
      '#EC4899'
    );

    expect(hasValidMove(board, largePiece)).toBe(false);
    expect(isGameOver(board, [largePiece])).toBe(true);
  });

  it('executes atomic turn placement and clearing', () => {
    let board = createEmptyBoard();

    // Fill row 0 cols 0..6
    for (let c = 0; c < 7; c++) {
      board[0][c] = { occupied: true, color: '#6366F1' };
    }

    const dotPiece = createPieceFromShape(
      { name: 'dot', shape: [[1]], weight: 1 },
      '#10B981'
    );

    // Place dot at (0, 7) to complete row 0
    const moveResult = executeMove(board, dotPiece, { row: 0, col: 7 }, 0, 0);

    expect(moveResult.totalLinesCleared).toBe(1);
    expect(moveResult.clearedRows).toEqual([0]);
    // Row 0 should now be cleared
    expect(moveResult.newBoard[0].every((cell) => !cell.occupied)).toBe(true);
    expect(moveResult.scoreResult.points).toBeGreaterThan(0);
  });
});
