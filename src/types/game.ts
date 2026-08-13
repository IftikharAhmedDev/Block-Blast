export interface Position {
  row: number;
  col: number;
}

export interface Cell {
  occupied: boolean;
  color: string | null;
  pieceId?: string | null;
}

export type Board = Cell[][];

export type PieceShape = number[][];

export interface Piece {
  id: string;
  shape: PieceShape;
  color: string;
  width: number;
  height: number;
  blockCount: number;
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'game_over';

export interface GameSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface GameState {
  board: Board;
  currentPieces: (Piece | null)[];
  score: number;
  highScore: number;
  comboCount: number;
  streakCount: number;
  status: GameStatus;
  movesCount: number;
  lastScoreResult: ScoreResult | null;
  settings: GameSettings;
  isBoardClear: boolean;
}

export interface ScoreResult {
  points: number;
  linesCleared: number;
  combo: number;
  streak: number;
  isAllClear: boolean;
}

export interface DragState {
  isDragging: boolean;
  pieceIndex: number | null;
  piece: Piece | null;
  dragPos: { x: number; y: number } | null;
  hoverBoardPos: Position | null;
  isValidPlacement: boolean;
}
