import React from 'react';
import { Crown, Heart, Zap, Flame, Pause, RotateCcw, Settings } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  comboCount: number;
  streakCount: number;
  onPause?: () => void;
  onRestart?: () => void;
  onOpenSettings?: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = React.memo(({
  score,
  highScore,
  comboCount,
  streakCount,
  onPause,
  onRestart,
  onOpenSettings,
}) => {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-1 px-2 select-none">
      {/* Top Header Row: Crown + Best Score on Left, Control Buttons on Right */}
      <div className="w-full flex items-center justify-between py-1">
        {/* High Score / Best */}
        <div className="flex items-center gap-1.5 text-[#facc15]">
          <Crown className="w-5 h-5 sm:w-6 sm:h-6 fill-[#facc15] text-[#facc15]" />
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#facc15]">
            {highScore.toLocaleString()}
          </span>
        </div>

        {/* Action Controls (Settings, Pause, Restart) */}
        <div className="flex items-center gap-1.5">
          {onPause && (
            <button
              onClick={onPause}
              title="Pause Game"
              aria-label="Pause Game"
              className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white active:scale-95 transition-all"
            >
              <Pause className="w-4 h-4 fill-current" />
            </button>
          )}

          {onRestart && (
            <button
              onClick={onRestart}
              title="Restart Game"
              aria-label="Restart Game"
              className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              title="Settings"
              aria-label="Settings"
              className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white active:scale-95 transition-all"
            >
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
            </button>
          )}
        </div>
      </div>

      {/* Main Score Area: Glowing Pink Heart above Giant White Score */}
      <div className="flex flex-col items-center justify-center -mt-1 relative">
        {/* Glowing Pink Heart emblem behind/above score */}
        <div className="relative flex items-center justify-center -mb-2">
          <div className="absolute w-14 h-14 bg-gradient-to-tr from-pink-500 via-fuchsia-500 to-purple-500 rounded-full blur-lg opacity-80 animate-pulse pointer-events-none" />
          <Heart className="w-10 h-10 sm:w-12 sm:h-12 fill-pink-500 text-pink-400 drop-shadow-[0_0_20px_rgba(236,72,153,0.9)] transition-transform duration-200 hover:scale-105" />
        </div>

        {/* Big Bold Current Score */}
        <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          {score.toLocaleString()}
        </span>

        {/* Badges: Combo & Streak */}
        <div className="flex items-center gap-2 mt-1">
          {comboCount > 1 && (
            <div className="flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 animate-combo-pop shadow-md">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-extrabold">{comboCount}x COMBO</span>
            </div>
          )}

          {streakCount > 0 && (
            <div className="flex items-center gap-1 px-3 py-0.5 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 shadow-md">
              <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
              <span className="text-xs font-extrabold">{streakCount} STREAK</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ScoreBoard.displayName = 'ScoreBoard';
