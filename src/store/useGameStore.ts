import { create } from 'zustand';
import { GameState, Position } from '../types/game';
import { createEmptyBoard } from '../engine/board';
import { generatePieces } from '../engine/pieceGenerator';
import { executeMove, isGameOver } from '../engine/gameEngine';
import { loadGameData, saveGameData, saveHighScore } from '../services/storageService';
import { audioService } from '../services/audioService';
import { hapticService } from '../services/hapticService';
import { GAME_CONFIG } from '../config/gameConfig';

interface GameStoreActions {
  startGame: () => void;
  restartGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  togglePause: () => void;
  toggleSound: () => void;
  placePieceAction: (pieceIndex: number, position: Position) => boolean;
  clearBoardClearFlag: () => void;
}

export type GameStore = GameState & GameStoreActions & {
  totalGamesPlayed: number;
  totalLinesCleared: number;
};

const initialSaved = loadGameData();

export const useGameStore = create<GameStore>((set, get) => ({
  board: createEmptyBoard(),
  currentPieces: [null, null, null],
  score: 0,
  highScore: initialSaved.highScore,
  comboCount: 0,
  streakCount: 0,
  status: 'idle',
  movesCount: initialSaved.totalMoves,
  totalGamesPlayed: initialSaved.totalGamesPlayed,
  totalLinesCleared: initialSaved.totalLinesCleared,
  lastScoreResult: null,
  isBoardClear: false,
  settings: {
    soundEnabled: initialSaved.soundEnabled,
    vibrationEnabled: initialSaved.vibrationEnabled,
  },

  clearBoardClearFlag: () => {
    set({ isBoardClear: false });
  },

  startGame: () => {
    const initialBoard = createEmptyBoard();
    const initialPieces = generatePieces(GAME_CONFIG.PIECES_PER_TURN);
    const saved = loadGameData();
    const newGamesCount = saved.totalGamesPlayed + 1;

    saveGameData({ totalGamesPlayed: newGamesCount });

    set({
      board: initialBoard,
      currentPieces: initialPieces,
      score: 0,
      highScore: saved.highScore,
      comboCount: 0,
      streakCount: 0,
      status: 'playing',
      movesCount: 0,
      totalGamesPlayed: newGamesCount,
      lastScoreResult: null,
      isBoardClear: false,
    });
  },

  restartGame: () => {
    get().startGame();
  },

  pauseGame: () => {
    if (get().status === 'playing') {
      set({ status: 'paused' });
    }
  },

  resumeGame: () => {
    if (get().status === 'paused') {
      set({ status: 'playing' });
    }
  },

  togglePause: () => {
    const current = get().status;
    if (current === 'playing') {
      set({ status: 'paused' });
    } else if (current === 'paused') {
      set({ status: 'playing' });
    }
  },

  toggleSound: () => {
    const nextSound = !get().settings.soundEnabled;
    saveGameData({ soundEnabled: nextSound });
    set((state) => ({
      settings: {
        ...state.settings,
        soundEnabled: nextSound,
      },
    }));
  },

  placePieceAction: (pieceIndex: number, position: Position): boolean => {
    const { board, currentPieces, score, highScore, comboCount, streakCount, status, settings, totalLinesCleared } = get();

    if (status !== 'playing') return false;
    if (pieceIndex < 0 || pieceIndex >= currentPieces.length) return false;

    const piece = currentPieces[pieceIndex];
    if (!piece) return false;

    try {
      // 1. Execute pure engine move
      const moveResult = executeMove(
        board,
        piece,
        position,
        comboCount,
        streakCount
      );

      const soundEnabled = settings.soundEnabled;
      const vibrationEnabled = settings.vibrationEnabled;

      audioService.playPlacement(soundEnabled);
      hapticService.vibratePlacement(vibrationEnabled);

      const isBoardClear = moveResult.scoreResult.isAllClear;

      if (isBoardClear) {
        audioService.playBoardClear(soundEnabled);
        hapticService.vibrateBoardClear(vibrationEnabled);
      } else if (moveResult.totalLinesCleared > 0) {
        audioService.playLineClear(soundEnabled, moveResult.scoreResult.combo);
        hapticService.vibrateLineClear(vibrationEnabled);
      }

      const newScore = score + moveResult.scoreResult.points;
      const newHighScore = Math.max(highScore, newScore);
      const newTotalLines = totalLinesCleared + moveResult.totalLinesCleared;
      const newTotalMoves = get().movesCount + 1;

      saveHighScore(newHighScore);
      saveGameData({
        totalLinesCleared: newTotalLines,
        totalMoves: newTotalMoves,
      });

      // 2. Consume placed piece
      const nextPieces = [...currentPieces];
      nextPieces[pieceIndex] = null;

      // 3. If all pieces in tray used, generate a new set of 3 pieces!
      const allUsed = nextPieces.every((p) => p === null);
      const piecesForNextState = allUsed
        ? generatePieces(GAME_CONFIG.PIECES_PER_TURN)
        : nextPieces;

      // 4. Check Game Over condition
      const checkOver = isGameOver(moveResult.newBoard, piecesForNextState);

      if (checkOver) {
        audioService.playGameOver(soundEnabled);
        hapticService.vibrateGameOver(vibrationEnabled);
      }

      set({
        board: moveResult.newBoard,
        currentPieces: piecesForNextState,
        score: newScore,
        highScore: newHighScore,
        comboCount: moveResult.scoreResult.combo,
        streakCount: moveResult.scoreResult.streak,
        status: checkOver ? 'game_over' : 'playing',
        movesCount: newTotalMoves,
        totalLinesCleared: newTotalLines,
        lastScoreResult: moveResult.scoreResult,
        isBoardClear,
      });

      return true;
    } catch {
      return false;
    }
  },
}));
