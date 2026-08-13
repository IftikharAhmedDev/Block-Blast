import React, { useEffect } from 'react';
import { Sparkles, Trophy } from 'lucide-react';
import { GAME_CONFIG } from '../config/gameConfig';

interface BoardClearOverlayProps {
  isOpen: boolean;
  onComplete?: () => void;
  durationMs?: number;
}

export const BoardClearOverlay: React.FC<BoardClearOverlayProps> = React.memo(({
  isOpen,
  onComplete,
  durationMs = 2200,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onComplete?.();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [isOpen, durationMs, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none p-4">
      {/* Glow backdrop */}
      <div className="absolute inset-0 bg-amber-500/10 backdrop-blur-xs animate-fade-in pointer-events-none" />

      {/* Main banner */}
      <div className="relative z-10 flex flex-col items-center gap-3 animate-board-clear-text text-center select-none">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/30 to-amber-400/20 border border-amber-400/50 backdrop-blur-md shadow-lg">
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-amber-300">
            Perfect Cleared!
          </span>
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-yellow-500 drop-shadow-[0_6px_12px_rgba(0,0,0,0.9)] uppercase">
          BOARD CLEAR!
        </h1>

        <div className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-slate-900/90 border border-amber-400/60 shadow-2xl">
          <Trophy className="w-6 h-6 text-amber-400" />
          <span className="text-xl sm:text-2xl font-black text-amber-300">
            +{GAME_CONFIG.SCORING.ALL_CLEAR_BONUS} BONUS!
          </span>
        </div>
      </div>
    </div>
  );
});

BoardClearOverlay.displayName = 'BoardClearOverlay';
