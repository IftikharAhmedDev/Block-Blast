import { Piece, PieceShape } from '../types/game';
import { PIECE_COLORS, SHAPE_LIBRARY, ShapeDefinition } from '../config/gameConfig';

export type PRNG = () => number;

/**
 * Creates a deterministic pseudo-random number generator (Mulberry32).
 */
export function createPRNG(seed: number): PRNG {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Calculates height, width, and block count for a 2D shape matrix.
 */
export function getShapeDimensions(shape: PieceShape): { width: number; height: number; blockCount: number } {
  const height = shape.length;
  let width = 0;
  let blockCount = 0;

  for (let r = 0; r < shape.length; r++) {
    width = Math.max(width, shape[r].length);
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] === 1) {
        blockCount++;
      }
    }
  }

  return { width, height, blockCount };
}

/**
 * Validates if a piece shape matrix is well-formed.
 */
export function isValidShape(shape: PieceShape): boolean {
  if (!Array.isArray(shape) || shape.length === 0) return false;
  let hasBlock = false;
  for (let r = 0; r < shape.length; r++) {
    if (!Array.isArray(shape[r])) return false;
    for (let c = 0; c < shape[r].length; c++) {
      const val = shape[r][c];
      if (val !== 0 && val !== 1) return false;
      if (val === 1) hasBlock = true;
    }
  }
  return hasBlock;
}

/**
 * Constructs a valid Piece object from a shape definition.
 */
export function createPieceFromShape(
  shapeDef: ShapeDefinition,
  color: string,
  idSuffix: string = ''
): Piece {
  const { width, height, blockCount } = getShapeDimensions(shapeDef.shape);
  const id = `piece_${shapeDef.name}_${Date.now()}_${idSuffix}`;

  return {
    id,
    shape: shapeDef.shape.map((row) => [...row]),
    color,
    width,
    height,
    blockCount,
  };
}

/**
 * Selects a random shape using weighted probability.
 */
export function getRandomShape(prng: PRNG = Math.random): ShapeDefinition {
  const totalWeight = SHAPE_LIBRARY.reduce((sum, item) => sum + item.weight, 0);
  let randomVal = prng() * totalWeight;

  for (const shapeDef of SHAPE_LIBRARY) {
    if (randomVal < shapeDef.weight) {
      return shapeDef;
    }
    randomVal -= shapeDef.weight;
  }

  return SHAPE_LIBRARY[0];
}

/**
 * Generates N pieces for a turn with color variety and balanced difficulty.
 */
export function generatePieces(
  count: number = 3,
  prng?: PRNG
): Piece[] {
  const rng = prng || Math.random;
  const pieces: Piece[] = [];
  const colorPalette = [...PIECE_COLORS];

  // Shuffle colors for variety
  for (let i = colorPalette.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [colorPalette[i], colorPalette[j]] = [colorPalette[j], colorPalette[i]];
  }

  let hasSmallPiece = false;

  for (let i = 0; i < count; i++) {
    let shapeDef = getRandomShape(rng);

    // Controlled randomness: ensure at least 1 small or medium piece among the 3 to prevent immediate lockouts
    if (i === count - 1 && !hasSmallPiece) {
      const smallShapes = SHAPE_LIBRARY.filter((s) => {
        const { blockCount } = getShapeDimensions(s.shape);
        return blockCount <= 3;
      });
      if (smallShapes.length > 0) {
        const idx = Math.floor(rng() * smallShapes.length);
        shapeDef = smallShapes[idx];
      }
    }

    const { blockCount } = getShapeDimensions(shapeDef.shape);
    if (blockCount <= 3) {
      hasSmallPiece = true;
    }

    const color = colorPalette[i % colorPalette.length];
    pieces.push(createPieceFromShape(shapeDef, color, `${i}`));
  }

  return pieces;
}
