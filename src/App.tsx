import { useEffect, useRef, useState } from 'react';
import { useGameStore } from './store/useGameStore';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useKeyboardControls } from './hooks/useKeyboardControls';
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

  const { dragSession, startDrag } = useDragAndDrop(boardRef);
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
      className="min-h-screen h-[100dvh] bg-[#2A3C69] text-slate-100 flex flex-col items-center justify-center p-3 sm:p-4 select-none touch-none overflow-hidden relative"
    >
      <main className="w-full max-w-[400px] flex flex-col justify-between h-full max-h-[780px] z-10 relative">
        {/* Unified Top Score & Controls HUD */}
        <ScoreBoard
          score={score}
          highScore={highScore}
          comboCount={comboCount}
          streakCount={streakCount}
          onPause={pauseGame}
          onRestart={restartGame}
          onOpenSettings={() => setIsSettingsOpen(true)}
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
        <div className="w-full flex-1 flex items-center justify-center my-auto">
          <GameBoard
            board={board}
            activePiece={activePiece}
            hoverPos={activeHoverPos}
            isValidPlacement={dragSession.isValidPlacement}
            previewCompletedLines={dragSession.previewCompletedLines}
            focusedCellPos={selectedPieceIndex !== null ? focusedCellPos : null}
            boardRef={boardRef}
          />
        </div>

        {/* Bottom Tray with 3 Pieces */}
        <div className="w-full pb-2">
          <PieceTray
            pieces={currentPieces}
            activePieceIndex={dragSession.pieceIndex !== null ? dragSession.pieceIndex : selectedPieceIndex}
            onStartDrag={startDrag}
          />
        </div>
      </main>

      {/* Floating Piece Dragging Overlay under Cursor/Touch */}
      {dragSession.isDragging && dragSession.piece && dragSession.dragPos && dragSession.dragPos.x > 0 && dragSession.dragPos.y > 0 && (
        <div
          className="fixed top-0 left-0 pointer-events-none z-50 block-preview-shadow will-change-transform"
          style={{
            transform: `translate3d(${dragSession.dragPos.x}px, ${dragSession.dragPos.y}px, 0) translate(-50%, -50%)`,
          }}
        >
          <PiecePreview piece={dragSession.piece} scale={1.15} />
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
