import React from 'react';
import { Heart, Settings } from 'lucide-react';

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
  onOpenSettings,
}) => {
  return (
    <div className="w-full flex flex-col gap-1 px-3 pt-2 select-none">
      {/* Top Header Row: Golden Crown + High Score on Left, Settings Gear on Right */}
      <div className="w-full flex items-center justify-between">
        {/* High Score / Best Score */}
        <div className="flex items-center gap-1.5 text-[#F59E0B]">
          {/* Stylized Golden 5-Tip Crown */}
          <svg
            className="w-7 h-7 fill-[#F59E0B] text-[#F59E0B] drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V17H19V19Z" />
          </svg>
          <span className="text-2xl font-black tracking-tight text-[#F59E0B] drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
            {highScore.toLocaleString()}
          </span>
        </div>

        {/* Action Controls: Settings Gear */}
        <div className="flex items-center">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              title="Settings"
              aria-label="Settings"
              className="p-1 text-[#839BC9] hover:text-white active:scale-90 transition-all cursor-pointer"
            >
              <Settings className="w-7 h-7 fill-current stroke-none" />
            </button>
          )}
        </div>
      </div>

      {/* Main Score Area: Glowing Pink Heart with Large White Digits Overlay */}
      <div className="relative flex flex-col items-center justify-center my-1 sm:my-2">
        <div className="relative flex items-center justify-center">
          {/* Vibrant Radial Pink Glow */}
          <div className="absolute w-24 h-24 bg-pink-500/50 rounded-full blur-2xl pointer-events-none" />

          {/* Heart Emblem */}
          <Heart
            className="w-16 h-16 sm:w-18 sm:h-18 fill-[#E32988] text-[#F472B6] drop-shadow-[0_0_22px_rgba(227,41,136,0.9)]"
          />

          {/* Large Bold White Score digits horizontally centered over heart */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] whitespace-nowrap">
              {score.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Dynamic Combo / Streak Float Notification */}
        {(comboCount > 1 || streakCount > 0) && (
          <div className="flex items-center gap-2 mt-1">
            {comboCount > 1 && (
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-combo-pop shadow">
                {comboCount}x COMBO
              </span>
            )}
            {streakCount > 0 && (
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-orange-400/20 text-orange-300 border border-orange-400/40 shadow">
                {streakCount} STREAK
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

ScoreBoard.displayName = 'ScoreBoard';
