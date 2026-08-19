import React from 'react';
import { Cell } from '../types/game';
import { Block } from './Block';

interface GridCellProps {
  cell: Cell;
  row: number;
  col: number;
  isPreview?: boolean;
  isValidPreview?: boolean;
  isLineHighlight?: boolean;
  isClearing?: boolean;
  isKeyboardFocused?: boolean;
}

export const GridCell: React.FC<GridCellProps> = React.memo(({
  cell,
  row,
  col,
  isPreview = false,
  isValidPreview = true,
  isLineHighlight = false,
  isClearing = false,
  isKeyboardFocused = false,
}) => {
  return (
    <div
      role="gridcell"
      aria-label={`Cell row ${row + 1} column ${col + 1}${cell.occupied ? ' occupied' : ' empty'}`}
      data-testid={`cell-${row}-${col}`}
      className={`relative w-full h-full p-0 flex items-center justify-center ${
        isKeyboardFocused ? 'ring-2 ring-indigo-400 z-30 scale-105' : ''
      } ${
        cell.occupied
          ? 'bg-transparent'
          : 'bg-[#18213B]/80 hover:bg-[#1E2847]/80 transition-colors duration-150'
      }`}
    >
      {cell.occupied && cell.color && (
        <Block color={cell.color} isClearing={isClearing} />
      )}

      {!cell.occupied && isPreview && isValidPreview && (
        <Block color="#6366F1" isPreview={true} />
      )}

      {/* Real-time Line Completion Glowing White Preview Overlay */}
      {isLineHighlight && (
        <div
          className="absolute inset-0 pointer-events-none z-20 rounded-[2px] bg-white/40 border border-white/90 shadow-[0_0_12px_rgba(255,255,255,0.7)] animate-pulse"
        />
      )}
    </div>
  );
});

GridCell.displayName = 'GridCell';
