import React from 'react';
import { Piece } from '../types/game';
import { PiecePreview } from './PiecePreview';

interface PieceTrayProps {
  pieces: (Piece | null)[];
  activePieceIndex: number | null;
  onStartDrag: (e: React.PointerEvent, pieceIndex: number, piece: Piece) => void;
}

export const PieceTray: React.FC<PieceTrayProps> = React.memo(({
  pieces,
  activePieceIndex,
  onStartDrag,
}) => {
  return (
    <div className="w-full max-w-md mx-auto grid grid-cols-3 gap-2 sm:gap-4 p-2 min-h-[110px] items-center justify-items-center">
      {pieces.map((piece, index) => {
        const isDraggingThis = activePieceIndex === index;

        return (
          <div
            key={piece ? piece.id : `empty-slot-${index}`}
            className="flex items-center justify-center min-h-[90px] w-full relative"
          >
            {piece && !isDraggingThis ? (
              <PiecePreview
                piece={piece}
                interactive={true}
                onPointerDown={(e) => onStartDrag(e, index, piece)}
              />
            ) : isDraggingThis ? (
              <div className="w-full h-full flex items-center justify-center opacity-20">
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-white/40 animate-spin" />
              </div>
            ) : (
              <div className="w-full h-full" />
            )}
          </div>
        );
      })}
    </div>
  );
});

PieceTray.displayName = 'PieceTray';
