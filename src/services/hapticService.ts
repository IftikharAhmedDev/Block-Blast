class HapticService {
  private isSupported(): boolean {
    return typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator;
  }

  /**
   * Light pulse when picking up a piece.
   */
  vibratePickup(enabled: boolean = true): void {
    if (!enabled || !this.isSupported()) return;
    try {
      navigator.vibrate(12);
    } catch {
      // Ignore fallback
    }
  }

  /**
   * Firm pulse when placing a piece.
   */
  vibratePlacement(enabled: boolean = true): void {
    if (!enabled || !this.isSupported()) return;
    try {
      navigator.vibrate(20);
    } catch {
      // Ignore fallback
    }
  }

  /**
   * Double pulse when clearing lines.
   */
  vibrateLineClear(enabled: boolean = true): void {
    if (!enabled || !this.isSupported()) return;
    try {
      navigator.vibrate([25, 40, 25]);
    } catch {
      // Ignore fallback
    }
  }

  /**
   * Strong pulse on game over.
   */
  vibrateGameOver(enabled: boolean = true): void {
    if (!enabled || !this.isSupported()) return;
    try {
      navigator.vibrate(60);
    } catch {
      // Ignore fallback
    }
  }

  /**
   * Festive multi-pulse vibration on board clear celebration.
   */
  vibrateBoardClear(enabled: boolean = true): void {
    if (!enabled || !this.isSupported()) return;
    try {
      navigator.vibrate([30, 50, 30, 50, 60]);
    } catch {
      // Ignore fallback
    }
  }
}

export const hapticService = new HapticService();
