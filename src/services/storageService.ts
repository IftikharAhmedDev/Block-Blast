import { GAME_CONFIG } from '../config/gameConfig';

export interface SavedGameData {
  version: number;
  highScore: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  totalGamesPlayed: number;
  totalLinesCleared: number;
  totalMoves: number;
}

export const DEFAULT_SAVED_DATA: SavedGameData = {
  version: 1,
  highScore: 0,
  soundEnabled: true,
  vibrationEnabled: true,
  totalGamesPlayed: 0,
  totalLinesCleared: 0,
  totalMoves: 0,
};

export function loadGameData(): SavedGameData {
  try {
    if (typeof localStorage === 'undefined') return { ...DEFAULT_SAVED_DATA };

    const raw = localStorage.getItem(GAME_CONFIG.STORAGE_KEY_HIGH_SCORE);
    if (!raw) return { ...DEFAULT_SAVED_DATA };

    // Try parsing JSON or handle legacy integer values
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const legacyScore = parseInt(raw, 10);
      if (!isNaN(legacyScore)) {
        return {
          ...DEFAULT_SAVED_DATA,
          highScore: legacyScore,
        };
      }
      return { ...DEFAULT_SAVED_DATA };
    }

    if (typeof parsed === 'number' && !isNaN(parsed)) {
      return {
        ...DEFAULT_SAVED_DATA,
        highScore: Math.max(0, parsed),
      };
    }

    if (typeof parsed !== 'object' || parsed === null) {
      return { ...DEFAULT_SAVED_DATA };
    }

    const data = parsed as Partial<SavedGameData>;

    return {
      version: typeof data.version === 'number' ? data.version : DEFAULT_SAVED_DATA.version,
      highScore: typeof data.highScore === 'number' && !isNaN(data.highScore) ? Math.max(0, data.highScore) : 0,
      soundEnabled: typeof data.soundEnabled === 'boolean' ? data.soundEnabled : true,
      vibrationEnabled: typeof data.vibrationEnabled === 'boolean' ? data.vibrationEnabled : true,
      totalGamesPlayed: typeof data.totalGamesPlayed === 'number' && !isNaN(data.totalGamesPlayed) ? Math.max(0, data.totalGamesPlayed) : 0,
      totalLinesCleared: typeof data.totalLinesCleared === 'number' && !isNaN(data.totalLinesCleared) ? Math.max(0, data.totalLinesCleared) : 0,
      totalMoves: typeof data.totalMoves === 'number' && !isNaN(data.totalMoves) ? Math.max(0, data.totalMoves) : 0,
    };
  } catch {
    return { ...DEFAULT_SAVED_DATA };
  }
}

export function saveGameData(update: Partial<SavedGameData>): SavedGameData {
  const current = loadGameData();
  const next: SavedGameData = {
    ...current,
    ...update,
    version: DEFAULT_SAVED_DATA.version,
  };

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(GAME_CONFIG.STORAGE_KEY_HIGH_SCORE, JSON.stringify(next));
    }
  } catch {
    // Ignore storage quota or cross-origin errors gracefully
  }

  return next;
}

export function getStoredHighScore(): number {
  return loadGameData().highScore;
}

export function saveHighScore(score: number): void {
  const currentHigh = getStoredHighScore();
  if (score > currentHigh) {
    saveGameData({ highScore: score });
  }
}
