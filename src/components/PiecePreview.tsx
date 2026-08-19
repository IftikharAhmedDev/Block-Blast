import React from 'react';
import { Piece } from '../types/game';
import { Block } from './Block';

interface PiecePreviewProps {
  piece: Piece;
  scale?: number;
  interactive?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
  className?: string;
}

export const PiecePreview: React.FC<PiecePreviewProps> = React.memo(({
  piece,
  scale = 1,
  interactive = false,
  onPointerDown,
  className = '',
}) => {
  const shape = piece.shape;
  const rows = shape.length;
  const cols = shape[0]?.length || 0;

  return (
    <div
      onPointerDown={interactive ? onPointerDown : undefined}
      className={`inline-grid gap-[2px] p-1 rounded-xl transition-transform ${
        interactive ? 'cursor-grab active:cursor-grabbing hover:scale-105 touch-none' : ''
      } ${className}`}
      style={{
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }}
    >
      {shape.map((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center"
          >
            {cell === 1 ? (
              <Block color={piece.color} />
            ) : (
              <div className="w-full h-full opacity-0" />
            )}
          </div>
        ))
      )}
    </div>
  );
});

PiecePreview.displayName = 'PiecePreview';
