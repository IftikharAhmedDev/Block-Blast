import { describe, it, expect } from 'vitest';
import { calculateScore, updateCombo } from '../engine/scoring';
import { createPieceFromShape } from '../engine/pieceGenerator';

describe('Scoring Pure Engine', () => {
  const piece = createPieceFromShape(
    { name: 'square2', shape: [[1, 1], [1, 1]], weight: 1 },
    '#6366F1'
  );

  it('calculates score for basic placement without line clear', () => {
    // 4 blocks = 40 pts
    const result = calculateScore(piece, 0, 0, 0, false);
    expect(result.points).toBe(40);
    expect(result.linesCleared).toBe(0);
    expect(result.combo).toBe(0);
  });

  it('calculates score for single line clear', () => {
    // 40 (placement) + 100 (1 line) + 30 (streak) = 170 pts
    const result = calculateScore(piece, 1, 0, 0, false);
    expect(result.points).toBe(170);
    expect(result.linesCleared).toBe(1);
    expect(result.combo).toBe(1);
    expect(result.streak).toBe(1);
  });

  it('calculates combo and streak multipliers for consecutive clears', () => {
    // Turn 2 with existing combo=1, streak=1 clearing 2 lines
    const result = calculateScore(piece, 2, 1, 1, false);
    expect(result.linesCleared).toBe(2);
    expect(result.combo).toBe(2);
    expect(result.streak).toBe(3);
    // placement: 40 + 200 (lines) + 60 (multiline) + 50 (combo) + 90 (streak) = 440
    expect(result.points).toBe(440);
  });

  it('resets combo when turn clears 0 lines', () => {
    expect(updateCombo(0, 3)).toBe(0);
    expect(updateCombo(1, 3)).toBe(4);
  });

  it('awards all-clear bonus when board is completely emptied', () => {
    const result = calculateScore(piece, 1, 0, 0, true);
    expect(result.isAllClear).toBe(true);
    expect(result.points).toBeGreaterThan(500);
  });
});
