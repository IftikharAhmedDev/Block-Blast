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

export interface BlockFacetColors {
  base: string;
  top: string;
  left: string;
  right: string;
  bottom: string;
}

export const BLOCK_THEMES: Record<string, BlockFacetColors> = {
  // Cyan / Sky Blue
  '#38BDF8': {
    base: '#34BAEB',
    top: '#8EE0FE',
    left: '#58CDFC',
    right: '#1A9CD4',
    bottom: '#087CAE',
  },
  // Cobalt / Royal Blue
  '#4361EE': {
    base: '#4A6BF2',
    top: '#8CA5FA',
    left: '#6B86F7',
    right: '#2B4AD4',
    bottom: '#1A34A8',
  },
  // Bright Orange
  '#F77F00': {
    base: '#F57A18',
    top: '#FFA95E',
    left: '#FA8F39',
    right: '#D45E06',
    bottom: '#A84400',
  },
  // Vivid Purple
  '#9D4EDD': {
    base: '#984DE3',
    top: '#C88AFA',
    left: '#B068F5',
    right: '#772CBF',
    bottom: '#551891',
  },
  // Golden Yellow
  '#EBB305': {
    base: '#E5AA15',
    top: '#FCE068',
    left: '#F2C43D',
    right: '#BC8606',
    bottom: '#8C6100',
  },
  // Emerald Green
  '#48BB78': {
    base: '#44BA4A',
    top: '#8BE590',
    left: '#64D46A',
    right: '#279B2E',
    bottom: '#17701C',
  },
  // Coral / Red
  '#E63946': {
    base: '#D9363E',
    top: '#F87F86',
    left: '#E8565D',
    right: '#B01E25',
    bottom: '#850F15',
  },
  // Pink
  '#EC4899': {
    base: '#E03387',
    top: '#F986BE',
    left: '#ED569E',
    right: '#B51B64',
    bottom: '#870E48',
  },
};

export const PIECE_COLORS = [
  '#38BDF8', // Cyan
  '#4361EE', // Blue
  '#F77F00', // Orange
  '#9D4EDD', // Purple
  '#EBB305', // Gold / Yellow
  '#48BB78', // Green
  '#E63946', // Red
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
