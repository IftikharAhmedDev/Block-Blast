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
      className={`relative w-full h-full rounded-[2px] sm:rounded-[3px] transition-colors p-0 flex items-center justify-center ${
        isKeyboardFocused ? 'ring-2 ring-indigo-400 z-30 scale-105' : ''
      } ${
        isAltPattern
          ? 'bg-[#161e3d] border border-[#1d274f]'
          : 'bg-[#141b38] border border-[#1a2347]'
      }`}
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
