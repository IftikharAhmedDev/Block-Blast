import { describe, it, expect, vi } from 'vitest';
import { audioService } from '../services/audioService';
import { hapticService } from '../services/hapticService';

describe('Audio & Haptics Service', () => {
  it('handles AudioService calls gracefully without throwing', () => {
    expect(() => audioService.playPickup(true)).not.toThrow();
    expect(() => audioService.playPlacement(true)).not.toThrow();
    expect(() => audioService.playLineClear(true, 1)).not.toThrow();
    expect(() => audioService.playCombo(true)).not.toThrow();
    expect(() => audioService.playGameOver(true)).not.toThrow();
    expect(() => audioService.playBoardClear(true)).not.toThrow();
  });

  it('respects sound enabled toggle when disabled', () => {
    const spy = vi.spyOn(audioService as unknown as { getContext: () => unknown }, 'getContext');
    audioService.playPickup(false);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('handles HapticService calls gracefully without throwing', () => {
    expect(() => hapticService.vibratePickup(true)).not.toThrow();
    expect(() => hapticService.vibratePlacement(true)).not.toThrow();
    expect(() => hapticService.vibrateLineClear(true)).not.toThrow();
    expect(() => hapticService.vibrateGameOver(true)).not.toThrow();
    expect(() => hapticService.vibrateBoardClear(true)).not.toThrow();
  });
});
