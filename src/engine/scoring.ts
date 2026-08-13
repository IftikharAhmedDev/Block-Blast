import { Piece, ScoreResult } from '../types/game';
import { GAME_CONFIG } from '../config/gameConfig';

/**
 * Updates the current combo count based on whether lines were cleared this turn.
 */
export function updateCombo(linesCleared: number, currentCombo: number): number {
  if (linesCleared > 0) {
    return currentCombo + 1;
  }
  return 0;
}

/**
 * Updates the current streak count (total consecutive turns with at least one line clear).
 */
export function updateStreak(linesCleared: number, currentStreak: number): number {
  if (linesCleared > 0) {
    return currentStreak + linesCleared;
  }
  return 0;
}

/**
 * Calculates score points earned for a turn.
 */
export function calculateScore(
  piece: Piece,
  linesCleared: number,
  currentCombo: number,
  currentStreak: number,
  isBoardEmpty: boolean = false
): ScoreResult {
  const newCombo = updateCombo(linesCleared, currentCombo);
  const newStreak = updateStreak(linesCleared, currentStreak);

  // 1. Placement points (e.g. 10 points per block placed)
  const placementPoints = piece.blockCount * GAME_CONFIG.SCORING.POINTS_PER_BLOCK;

  // 2. Line clear base points
  const linePoints = linesCleared * GAME_CONFIG.SCORING.POINTS_PER_LINE;

  // 3. Multi-line bonus multiplier (clearing 2+ lines at once gives extra)
  const multiLineBonus = linesCleared > 1 ? Math.floor(linesCleared * 1.5) * 20 : 0;

  // 4. Combo bonus (sequential turns clearing lines)
  const comboBonus = newCombo > 1 ? (newCombo - 1) * GAME_CONFIG.SCORING.COMBO_BONUS_MULTIPLIER : 0;

  // 5. Streak bonus
  const streakBonus = linesCleared > 0 ? newStreak * GAME_CONFIG.SCORING.STREAK_BONUS : 0;

  // 6. All clear bonus
  const allClearBonus = isBoardEmpty && linesCleared > 0 ? GAME_CONFIG.SCORING.ALL_CLEAR_BONUS : 0;

  const points = placementPoints + linePoints + multiLineBonus + comboBonus + streakBonus + allClearBonus;

  return {
    points,
    linesCleared,
    combo: newCombo,
    streak: newStreak,
    isAllClear: isBoardEmpty && linesCleared > 0,
  };
}
