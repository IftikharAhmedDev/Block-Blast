import React from 'react';
import { Play, RotateCcw, Settings, X } from 'lucide-react';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = React.memo(({
  isOpen,
  onResume,
  onRestart,
  onOpenSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center gap-4 animate-modal-in">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white">Game Paused</h2>
          <button
            onClick={onResume}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full flex flex-col gap-3 mt-2">
          {/* Resume */}
          <button
            onClick={onResume}
            className="w-full py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all min-h-[44px]"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Resume Game</span>
          </button>

          {/* Restart */}
          <button
            onClick={() => {
              onResume();
              onRestart();
            }}
            className="w-full py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-all min-h-[44px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Game</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="w-full py-3 px-5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-semibold flex items-center justify-center gap-2 border border-slate-800 active:scale-95 transition-all min-h-[44px]"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
});

PauseModal.displayName = 'PauseModal';
