import { useEffect, useRef, useState } from 'react';
import { useGameStore } from './store/useGameStore';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { Controls } from './components/Controls';
import { ScoreBoard } from './components/ScoreBoard';
import { GameBoard } from './components/GameBoard';
import { PieceTray } from './components/PieceTray';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { SettingsModal } from './components/SettingsModal';
import { PiecePreview } from './components/PiecePreview';
import { Fireworks } from './components/Fireworks';
import { BoardClearOverlay } from './components/BoardClearOverlay';

interface FloatingScore {
  id: number;
  points: number;
  combo: number;
}

export function App() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    board,
    currentPieces,
    score,
    highScore,
    comboCount,
    streakCount,
    status,
    lastScoreResult,
    isBoardClear,
    startGame,
    restartGame,
    pauseGame,
    resumeGame,
    clearBoardClearFlag,
  } = useGameStore();

  const { dragSession, startDrag, onPointerMove, endDrag } = useDragAndDrop(boardRef);
  const { selectedPieceIndex, focusedCellPos } = useKeyboardControls();

  // Combine pointer drag or keyboard piece selection for preview
  const activePiece = dragSession.piece || (selectedPieceIndex !== null ? currentPieces[selectedPieceIndex] : null);
  const activeHoverPos = dragSession.hoverBoardPos || (selectedPieceIndex !== null ? focusedCellPos : null);

  // Trigger floating score animation whenever lastScoreResult updates
  useEffect(() => {
    if (lastScoreResult && lastScoreResult.points > 0) {
      const id = Date.now();
      const newScore: FloatingScore = {
        id,
        points: lastScoreResult.points,
        combo: lastScoreResult.combo,
      };

      setFloatingScores((prev) => [...prev.slice(-2), newScore]);

      const timer = setTimeout(() => {
        setFloatingScores((prev) => prev.filter((s) => s.id !== id));
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [lastScoreResult]);

  // Initialize game session on mount
  useEffect(() => {
    if (status === 'idle') {
      startGame();
    }
  }, [status, startGame]);

  return (
    <div
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className="min-h-screen h-[100dvh] bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-4 sm:p-6 pt-[env(safe-area-inset-top,1rem)] pb-[env(safe-area-inset-bottom,1rem)] select-none touch-none overflow-hidden relative"
    >
      {/* Vibrant background ambient glows */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-b from-indigo-600/30 via-violet-600/20 to-transparent rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-t from-violet-600/25 via-pink-600/15 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-emerald-500/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-72 h-72 bg-amber-500/15 rounded-full blur-[90px] pointer-events-none" />

      <main className="w-full max-w-md flex flex-col gap-4 sm:gap-5 z-10 my-auto relative">
        {/* Top bar controls */}
        <Controls
          onPause={pauseGame}
          onRestart={restartGame}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Score & Combo HUD */}
        <ScoreBoard
          score={score}
          highScore={highScore}
          comboCount={comboCount}
          streakCount={streakCount}
        />

        {/* Floating Score Popups Container */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 pointer-events-none z-30 flex flex-col items-center gap-1">
          {floatingScores.map((s) => (
            <div
              key={s.id}
              className="animate-score-float font-black text-amber-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] text-xl sm:text-2xl whitespace-nowrap bg-slate-900/90 px-3 py-1 rounded-full border border-amber-400/40"
            >
              +{s.points} {s.combo > 1 ? `(${s.combo}x Combo!)` : ''}
            </div>
          ))}
        </div>

        {/* 8x8 Main Game Board */}
        <GameBoard
          board={board}
          activePiece={activePiece}
          hoverPos={activeHoverPos}
          isValidPlacement={dragSession.isValidPlacement}
          focusedCellPos={selectedPieceIndex !== null ? focusedCellPos : null}
          boardRef={boardRef}
        />

        {/* Bottom Tray with 3 Pieces */}
        <PieceTray
          pieces={currentPieces}
          activePieceIndex={dragSession.pieceIndex !== null ? dragSession.pieceIndex : selectedPieceIndex}
          onStartDrag={startDrag}
        />
      </main>

      {/* Hardware-Accelerated Floating Piece Dragging Overlay */}
      {dragSession.isDragging && dragSession.piece && dragSession.dragPos && (
        <div
          className="fixed top-0 left-0 pointer-events-none z-50 block-preview-shadow animate-pickup will-change-transform"
          style={{
            transform: `translate3d(${dragSession.dragPos.x}px, ${dragSession.dragPos.y}px, 0) translate(-50%, -50%)`,
          }}
        >
          <PiecePreview piece={dragSession.piece} scale={1.1} />
        </div>
      )}

      {/* Board Clear Celebration Fireworks & Text Banner Overlay */}
      <Fireworks active={isBoardClear} onComplete={clearBoardClearFlag} />
      <BoardClearOverlay isOpen={isBoardClear} onComplete={clearBoardClearFlag} />

      {/* Pause Modal */}
      <PauseModal
        isOpen={status === 'paused'}
        onResume={resumeGame}
        onRestart={restartGame}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={status === 'game_over'}
        score={score}
        highScore={highScore}
        onRestart={restartGame}
      />
    </div>
  );
}

export default App;
