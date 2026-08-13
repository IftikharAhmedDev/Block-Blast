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
    <div className="w-full max-w-md mx-auto grid grid-cols-3 gap-3 sm:gap-4 p-3 bg-slate-900/40 rounded-2xl border border-slate-700/40 backdrop-blur-xl shadow-xl min-h-[120px]">
      {pieces.map((piece, index) => {
        const isDraggingThis = activePieceIndex === index;

        return (
          <div
            key={piece ? piece.id : `empty-slot-${index}`}
            className="flex items-center justify-center min-h-[100px] rounded-xl border border-slate-800/40 bg-slate-950/40 relative overflow-hidden"
          >
            {piece && !isDraggingThis ? (
              <PiecePreview
                piece={piece}
                interactive={true}
                onPointerDown={(e) => onStartDrag(e, index, piece)}
              />
            ) : isDraggingThis ? (
              <div className="w-full h-full flex items-center justify-center opacity-30">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-indigo-400/50 animate-spin" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full bg-slate-800/50" />
            )}
          </div>
        );
      })}
    </div>
  );
});

PieceTray.displayName = 'PieceTray';
