import React from 'react';
import { Trophy, Zap, Flame } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  comboCount: number;
  streakCount: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = React.memo(({
  score,
  highScore,
  comboCount,
  streakCount,
}) => {
  return (
    <div className="w-full max-w-md mx-auto flex items-center justify-between gap-3 p-3 sm:p-4 bg-slate-900/40 rounded-2xl border border-slate-700/40 backdrop-blur-xl shadow-lg">
      {/* Current Score */}
      <div className="flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Score</span>
        <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
          {score.toLocaleString()}
        </span>
      </div>

      {/* Badges: Combo & Streak */}
      <div className="flex items-center gap-2">
        {comboCount > 1 && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 animate-combo-pop">
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold">{comboCount}x Combo</span>
          </div>
        )}

        {streakCount > 0 && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300">
            <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
            <span className="text-xs font-bold">{streakCount} Streak</span>
          </div>
        )}
      </div>

      {/* High Score */}
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-1 text-amber-400">
          <Trophy className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Best</span>
        </div>
        <span className="text-lg sm:text-xl font-bold text-slate-200">
          {highScore.toLocaleString()}
        </span>
      </div>
    </div>
  );
});

ScoreBoard.displayName = 'ScoreBoard';
