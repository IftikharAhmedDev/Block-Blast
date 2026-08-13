import React from 'react';
import { RotateCcw, Trophy } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  highScore: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = React.memo(({
  isOpen,
  score,
  highScore,
  onRestart,
}) => {
  if (!isOpen) return null;

  const isNewHigh = score > 0 && score >= highScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center gap-5 animate-modal-in">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
          <Trophy className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-white">No More Moves!</h2>
          <p className="text-sm text-slate-400 mt-1">None of the available pieces can fit on the board.</p>
        </div>

        {isNewHigh && (
          <div className="px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider animate-pulse">
            🎉 New High Score!
          </div>
        )}

        <div className="w-full bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex justify-around items-center">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-semibold uppercase">Score</span>
            <span className="text-2xl font-black text-white">{score.toLocaleString()}</span>
          </div>

          <div className="w-px h-8 bg-slate-800" />

          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-semibold uppercase">Best</span>
            <span className="text-2xl font-black text-amber-400">{highScore.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Play Again</span>
        </button>
      </div>
    </div>
  );
});

GameOverModal.displayName = 'GameOverModal';
