import { useState, useEffect, useCallback } from 'react';
import { Position } from '../types/game';
import { useGameStore } from '../store/useGameStore';
import { canPlacePiece } from '../engine/board';
import { audioService } from '../services/audioService';

export function useKeyboardControls() {
  const [selectedPieceIndex, setSelectedPieceIndex] = useState<number | null>(null);
  const [focusedCellPos, setFocusedCellPos] = useState<Position>({ row: 3, col: 3 });

  const { board, currentPieces, placePieceAction, status, settings } = useGameStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (status !== 'playing') return;

      // Select piece slot using numbers 1, 2, 3
      if (['1', '2', '3'].includes(e.key)) {
        const index = parseInt(e.key, 10) - 1;
        if (currentPieces[index]) {
          setSelectedPieceIndex(index);
          audioService.playPickup(settings.soundEnabled);
        }
        return;
      }

      // Deselect or cancel selection on Escape
      if (e.key === 'Escape') {
        setSelectedPieceIndex(null);
        return;
      }

      // Navigate grid with arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        setFocusedCellPos((prev) => {
          let r = prev.row;
          let c = prev.col;
          if (e.key === 'ArrowUp') r = Math.max(0, r - 1);
          if (e.key === 'ArrowDown') r = Math.min(7, r + 1);
          if (e.key === 'ArrowLeft') c = Math.max(0, c - 1);
          if (e.key === 'ArrowRight') c = Math.min(7, c + 1);
          return { row: r, col: c };
        });
        return;
      }

      // Place selected piece on Enter or Space
      if (['Enter', ' '].includes(e.key)) {
        e.preventDefault();
        if (selectedPieceIndex !== null && currentPieces[selectedPieceIndex]) {
          const piece = currentPieces[selectedPieceIndex]!;
          if (canPlacePiece(board, piece, focusedCellPos)) {
            const success = placePieceAction(selectedPieceIndex, focusedCellPos);
            if (success) {
              setSelectedPieceIndex(null);
            }
          }
        }
      }
    },
    [status, currentPieces, selectedPieceIndex, focusedCellPos, board, placePieceAction, settings.soundEnabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    selectedPieceIndex,
    focusedCellPos,
    setSelectedPieceIndex,
  };
}
