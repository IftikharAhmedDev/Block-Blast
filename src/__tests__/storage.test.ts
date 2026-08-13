import { describe, it, expect, beforeEach } from 'vitest';
import { loadGameData, saveGameData, getStoredHighScore, saveHighScore, DEFAULT_SAVED_DATA } from '../services/storageService';
import { GAME_CONFIG } from '../config/gameConfig';

describe('Storage Persistence Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns default data when localStorage is empty', () => {
    const data = loadGameData();
    expect(data).toEqual(DEFAULT_SAVED_DATA);
  });

  it('saves and loads game data correctly', () => {
    saveGameData({ highScore: 500, soundEnabled: false, totalMoves: 42 });
    const data = loadGameData();
    expect(data.highScore).toBe(500);
    expect(data.soundEnabled).toBe(false);
    expect(data.totalMoves).toBe(42);
  });

  it('recovers safely from corrupted non-JSON localStorage string', () => {
    localStorage.setItem(GAME_CONFIG.STORAGE_KEY_HIGH_SCORE, '{{invalid_json_string!!');
    const data = loadGameData();
    expect(data).toEqual(DEFAULT_SAVED_DATA);
  });

  it('parses legacy single integer values safely', () => {
    localStorage.setItem(GAME_CONFIG.STORAGE_KEY_HIGH_SCORE, '750');
    const data = loadGameData();
    expect(data.highScore).toBe(750);
  });

  it('updates high score only when new score is higher', () => {
    saveHighScore(100);
    expect(getStoredHighScore()).toBe(100);

    saveHighScore(50);
    expect(getStoredHighScore()).toBe(100); // Unchanged

    saveHighScore(200);
    expect(getStoredHighScore()).toBe(200); // Updated
  });
});
