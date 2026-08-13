import { PieceShape } from '../types/game';

export const GAME_CONFIG = {
  BOARD_SIZE: 8,
  PIECES_PER_TURN: 3,
  SCORING: {
    POINTS_PER_BLOCK: 10,
    POINTS_PER_LINE: 100,
    COMBO_BONUS_MULTIPLIER: 50,
    STREAK_BONUS: 30,
    ALL_CLEAR_BONUS: 500,
  },
  STORAGE_KEY_HIGH_SCORE: 'block_blast_high_score',
} as const;

export const PIECE_COLORS = [
  '#6366F1', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#8B5CF6', // Violet
  '#F97316', // Orange
  '#EF4444', // Red
] as const;

export interface ShapeDefinition {
  name: string;
  shape: PieceShape;
  weight: number; // For controlled randomness
}

export const SHAPE_LIBRARY: ShapeDefinition[] = [
  // 1. Single block
  {
    name: 'dot',
    shape: [[1]],
    weight: 2,
  },
  // 2. Horizontal 2
  {
    name: 'h2',
    shape: [[1, 1]],
    weight: 3,
  },
  // 3. Vertical 2
  {
    name: 'v2',
    shape: [
      [1],
      [1],
    ],
    weight: 3,
  },
  // 4. Horizontal 3
  {
    name: 'h3',
    shape: [[1, 1, 1]],
    weight: 4,
  },
  // 5. Vertical 3
  {
    name: 'v3',
    shape: [
      [1],
      [1],
      [1],
    ],
    weight: 4,
  },
  // 6. Horizontal 4
  {
    name: 'h4',
    shape: [[1, 1, 1, 1]],
    weight: 3,
  },
  // 7. Vertical 4
  {
    name: 'v4',
    shape: [
      [1],
      [1],
      [1],
      [1],
    ],
    weight: 3,
  },
  // 8. Square 2x2
  {
    name: 'square2',
    shape: [
      [1, 1],
      [1, 1],
    ],
    weight: 4,
  },
  // 9. Square 3x3
  {
    name: 'square3',
    shape: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    weight: 1,
  },
  // 10. Small L (2x2 corner)
  {
    name: 'corner2_tl',
    shape: [
      [1, 1],
      [1, 0],
    ],
    weight: 3,
  },
  {
    name: 'corner2_tr',
    shape: [
      [1, 1],
      [0, 1],
    ],
    weight: 3,
  },
  {
    name: 'corner2_bl',
    shape: [
      [1, 0],
      [1, 1],
    ],
    weight: 3,
  },
  {
    name: 'corner2_br',
    shape: [
      [0, 1],
      [1, 1],
    ],
    weight: 3,
  },
  // 11. Large L (3x3 corner)
  {
    name: 'corner3_tl',
    shape: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ],
    weight: 2,
  },
  {
    name: 'corner3_br',
    shape: [
      [0, 0, 1],
      [0, 0, 1],
      [1, 1, 1],
    ],
    weight: 2,
  },
  // 12. T shapes
  {
    name: 't_up',
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    weight: 3,
  },
  {
    name: 't_down',
    shape: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    weight: 3,
  },
  // 13. S / Z shapes
  {
    name: 's_shape',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    weight: 2,
  },
  {
    name: 'z_shape',
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    weight: 2,
  },
];
