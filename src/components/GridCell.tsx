import React from 'react';
import { Cell } from '../types/game';
import { Block } from './Block';

interface GridCellProps {
  cell: Cell;
  row: number;
  col: number;
  isPreview?: boolean;
  isValidPreview?: boolean;
  isClearing?: boolean;
  isKeyboardFocused?: boolean;
}

export const GridCell: React.FC<GridCellProps> = React.memo(({
  cell,
  row,
  col,
  isPreview = false,
  isValidPreview = true,
  isClearing = false,
  isKeyboardFocused = false,
}) => {
  const isAltPattern = (row + col) % 2 === 0;

  return (
    <div
      role="gridcell"
      aria-label={`Cell row ${row + 1} column ${col + 1}${cell.occupied ? ' occupied' : ' empty'}`}
      data-testid={`cell-${row}-${col}`}
      className={`relative w-full h-full rounded-md transition-colors p-[0.5px] flex items-center justify-center ${
        isKeyboardFocused ? 'ring-2 ring-indigo-400 z-30 scale-105' : ''
      } ${
        isAltPattern
          ? 'bg-slate-900/60 border border-slate-800/40'
          : 'bg-slate-900/35 border border-slate-800/25'
      } cell-shadow`}
    >
      {cell.occupied && cell.color && (
        <Block color={cell.color} isClearing={isClearing} />
      )}

      {!cell.occupied && isPreview && (
        <Block color="#6366F1" isPreview={true} isValidPlacement={isValidPreview} />
      )}
    </div>
  );
});

GridCell.displayName = 'GridCell';
