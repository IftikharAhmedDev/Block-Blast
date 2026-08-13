import React from 'react';
import { Volume2, VolumeX, X, Info } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = React.memo(({
  isOpen,
  onClose,
}) => {
  const { settings, toggleSound, movesCount, highScore, totalGamesPlayed, totalLinesCleared } = useGameStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center gap-5 animate-modal-in">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full flex flex-col gap-3">
          {/* Sound Toggle */}
          <div className="w-full flex items-center justify-between p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-indigo-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500" />
              )}
              <span className="text-sm font-semibold text-slate-200">Sound Effects</span>
            </div>

            <button
              onClick={toggleSound}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 flex items-center min-h-[44px] min-w-[44px] ${
                settings.soundEnabled ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Detailed Statistics Summary Grid */}
          <div className="w-full p-4 bg-slate-950/60 rounded-2xl border border-slate-800 grid grid-cols-2 gap-3 text-center">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Games Played</span>
              <span className="text-base font-black text-white">{totalGamesPlayed}</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Lines Cleared</span>
              <span className="text-base font-black text-indigo-400">{totalLinesCleared}</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Moves</span>
              <span className="text-base font-black text-white">{movesCount}</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Personal Best</span>
              <span className="text-base font-black text-amber-400">{highScore}</span>
            </div>
          </div>

          {/* Reduced Motion & Performance Info */}
          <div className="w-full p-3 bg-slate-950/40 rounded-2xl border border-slate-800/60 flex items-start gap-2.5 text-left">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-400">
              <p className="font-semibold text-slate-300">GPU Accelerated</p>
              <p>Supports system <span className="text-indigo-300">prefers-reduced-motion</span> and 60 FPS touch pointer controls.</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 active:scale-95 transition-all min-h-[44px]"
        >
          Done
        </button>
      </div>
    </div>
  );
});

SettingsModal.displayName = 'SettingsModal';
