import React from 'react';
import { Board, Piece, Position } from '../types/game';
import { GridCell } from './GridCell';

interface GameBoardProps {
  board: Board;
  activePiece: Piece | null;
  hoverPos: Position | null;
  isValidPlacement: boolean;
  focusedCellPos?: Position | null;
  boardRef: React.RefObject<HTMLDivElement | null>;
}

export const GameBoard: React.FC<GameBoardProps> = React.memo(({
  board,
  activePiece,
  hoverPos,
  isValidPlacement,
  focusedCellPos,
  boardRef,
}) => {
  const boardSize = board.length;

  /**
   * Helper to check if a specific (r, c) cell falls within the active piece's preview footprint.
   */
  const isCellInPreview = (r: number, c: number): boolean => {
    if (!activePiece || !hoverPos) return false;

    const shape = activePiece.shape;
    const relR = r - hoverPos.row;
    const relC = c - hoverPos.col;

    if (relR >= 0 && relR < shape.length && relC >= 0 && relC < shape[relR].length) {
      return shape[relR][relC] === 1;
    }

    return false;
  };

  return (
    <div className="w-full max-w-md mx-auto aspect-square p-1.5 sm:p-2 bg-[#141b36] rounded-xl sm:rounded-2xl border-2 border-[#1e2950] shadow-[0_8px_25px_rgba(0,0,0,0.6)] relative overflow-hidden">
      <div
        ref={boardRef}
        role="grid"
        aria-label="Block Blast 8x8 Puzzle Board"
        className="w-full h-full grid grid-cols-8 grid-rows-8 gap-0 bg-[#161e3b] touch-none"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${boardSize}, minmax(0, 1fr))`,
        }}
      >
        {board.map((rowCells, r) =>
          rowCells.map((cell, c) => {
            const inPreview = isCellInPreview(r, c);
            const isFocused = focusedCellPos?.row === r && focusedCellPos?.col === c;
            return (
              <GridCell
                key={`${r}-${c}`}
                cell={cell}
                row={r}
                col={c}
                isPreview={inPreview}
                isValidPreview={isValidPlacement}
                isKeyboardFocused={isFocused}
              />
            );
          })
        )}
      </div>
    </div>
  );
});

GameBoard.displayName = 'GameBoard';
