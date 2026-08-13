import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../store/useGameStore';
import { createEmptyBoard } from '../engine/board';

describe('Board Clear Celebration Logic', () => {
  beforeEach(() => {
    useGameStore.getState().startGame();
  });

  it('initializes with isBoardClear as false', () => {
    expect(useGameStore.getState().isBoardClear).toBe(false);
  });

  it('can clear the isBoardClear flag via clearBoardClearFlag action', () => {
    useGameStore.setState({ isBoardClear: true });
    expect(useGameStore.getState().isBoardClear).toBe(true);

    useGameStore.getState().clearBoardClearFlag();
    expect(useGameStore.getState().isBoardClear).toBe(false);
  });

  it('triggers isBoardClear state when a move causes all cells to be cleared', () => {
    // Construct a board where placing a single dot block at (0, 0) completes row 0 and column 0, leaving an empty board
    const board = createEmptyBoard();

    // Fill row 0 (except col 0)
    for (let c = 1; c < 8; c++) {
      board[0][c] = { occupied: true, color: '#6366F1' };
    }
    // Fill col 0 (except row 0)
    for (let r = 1; r < 8; r++) {
      board[r][0] = { occupied: true, color: '#6366F1' };
    }

    useGameStore.setState({
      board,
      currentPieces: [
        {
          id: 'test-dot',
          shape: [[1]],
          color: '#6366F1',
          width: 1,
          height: 1,
          blockCount: 1,
        },
        null,
        null,
      ],
    });

    const placed = useGameStore.getState().placePieceAction(0, { row: 0, col: 0 });
    expect(placed).toBe(true);

    const state = useGameStore.getState();
    expect(state.isBoardClear).toBe(true);
    expect(state.lastScoreResult?.isAllClear).toBe(true);
    expect(state.score).toBeGreaterThanOrEqual(500); // 500 points all clear bonus
  });

  it('does NOT trigger isBoardClear if blocks remain on the board', () => {
    const board = createEmptyBoard();

    // Fill row 0 (except col 0)
    for (let c = 1; c < 8; c++) {
      board[0][c] = { occupied: true, color: '#6366F1' };
    }
    // Add an extra block at (5, 5) that won't be cleared
    board[5][5] = { occupied: true, color: '#6366F1' };

    useGameStore.setState({
      board,
      currentPieces: [
        {
          id: 'test-dot',
          shape: [[1]],
          color: '#6366F1',
          width: 1,
          height: 1,
          blockCount: 1,
        },
        null,
        null,
      ],
    });

    const placed = useGameStore.getState().placePieceAction(0, { row: 0, col: 0 });
    expect(placed).toBe(true);

    const state = useGameStore.getState();
    expect(state.isBoardClear).toBe(false);
    expect(state.lastScoreResult?.isAllClear).toBe(false);
  });
});
