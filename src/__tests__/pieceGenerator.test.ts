import { describe, it, expect } from 'vitest';
import {
  createPRNG,
  generatePieces,
  getShapeDimensions,
  isValidShape,
} from '../engine/pieceGenerator';
import { SHAPE_LIBRARY } from '../config/gameConfig';

describe('Piece Generator Engine', () => {
  it('validates all library shapes', () => {
    for (const shapeDef of SHAPE_LIBRARY) {
      expect(isValidShape(shapeDef.shape)).toBe(true);
      const { width, height, blockCount } = getShapeDimensions(shapeDef.shape);
      expect(width).toBeGreaterThan(0);
      expect(height).toBeGreaterThan(0);
      expect(blockCount).toBeGreaterThan(0);
    }
  });

  it('generates exactly 3 pieces per turn', () => {
    const pieces = generatePieces(3);
    expect(pieces.length).toBe(3);
    pieces.forEach((p) => {
      expect(p.id).toBeDefined();
      expect(p.color).toBeDefined();
      expect(p.shape.length).toBeGreaterThan(0);
    });
  });

  it('is deterministic when provided a seeded PRNG', () => {
    const prng1 = createPRNG(12345);
    const prng2 = createPRNG(12345);

    const pieces1 = generatePieces(3, prng1);
    const pieces2 = generatePieces(3, prng2);

    expect(pieces1[0].width).toBe(pieces2[0].width);
    expect(pieces1[0].height).toBe(pieces2[0].height);
    expect(pieces1[0].blockCount).toBe(pieces2[0].blockCount);
    expect(pieces1[1].blockCount).toBe(pieces2[1].blockCount);
  });
});
