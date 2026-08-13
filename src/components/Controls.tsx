import React from 'react';
import { Pause, RotateCcw, Settings } from 'lucide-react';

interface ControlsProps {
  onPause: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
}

export const Controls: React.FC<ControlsProps> = React.memo(({
  onPause,
  onRestart,
  onOpenSettings,
}) => {
  return (
    <div className="w-full max-w-md mx-auto flex items-center justify-between px-1">
      {/* Brand Title */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-indigo-500/20">
          BB
        </div>
        <h1 className="text-xl font-extrabold text-white tracking-tight">
          Block Blast
        </h1>
      </div>

      {/* Control Buttons with comfortable touch targets (44px min) */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPause}
          title="Pause Game"
          aria-label="Pause Game"
          className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 active:scale-95 transition-all shadow-md flex items-center justify-center min-h-[44px] min-w-[44px]"
        >
          <Pause className="w-4 h-4 fill-current" />
        </button>

        <button
          onClick={onRestart}
          title="Restart Game"
          aria-label="Restart Game"
          className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 active:scale-95 transition-all shadow-md flex items-center justify-center min-h-[44px] min-w-[44px]"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenSettings}
          title="Settings"
          aria-label="Settings"
          className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 active:scale-95 transition-all shadow-md flex items-center justify-center min-h-[44px] min-w-[44px]"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

Controls.displayName = 'Controls';
