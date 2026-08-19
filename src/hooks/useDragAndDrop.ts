import { useState, useRef, useCallback, useEffect } from 'react';
import { Piece, Position } from '../types/game';
import { canPlacePiece } from '../engine/board';
import { getPreviewCompletedLines } from '../engine/lines';
import { useGameStore } from '../store/useGameStore';
import { audioService } from '../services/audioService';
import { hapticService } from '../services/hapticService';

export interface DragSession {
  isDragging: boolean;
  pieceIndex: number | null;
  piece: Piece | null;
  dragPos: { x: number; y: number } | null;
  hoverBoardPos: Position | null;
  isValidPlacement: boolean;
  previewCompletedLines: { rows: number[]; cols: number[] };
}

export function useDragAndDrop(boardRef: React.RefObject<HTMLDivElement | null>) {
  const [dragSession, setDragSession] = useState<DragSession>({
    isDragging: false,
    pieceIndex: null,
    piece: null,
    dragPos: null,
    hoverBoardPos: null,
    isValidPlacement: false,
    previewCompletedLines: { rows: [], cols: [] },
  });

  const boardBoundsRef = useRef<DOMRect | null>(null);
  const dragSessionRef = useRef<DragSession>(dragSession);

  useEffect(() => {
    dragSessionRef.current = dragSession;
  }, [dragSession]);

  /**
   * Recalculates cached board dimensions.
   */
  const updateCachedBounds = useCallback(() => {
    if (boardRef.current) {
      boardBoundsRef.current = boardRef.current.getBoundingClientRect();
    }
  }, [boardRef]);

  useEffect(() => {
    window.addEventListener('resize', updateCachedBounds, { passive: true });
    window.addEventListener('scroll', updateCachedBounds, { passive: true });
    return () => {
      window.removeEventListener('resize', updateCachedBounds);
      window.removeEventListener('scroll', updateCachedBounds);
    };
  }, [updateCachedBounds]);

  /**
   * Calculates board cell position from screen coordinates using cached bounds.
   */
  const calculateBoardPosition = useCallback(
    (clientX: number, clientY: number, piece: Piece): Position | null => {
      let rect = boardBoundsRef.current;
      if (!rect && boardRef.current) {
        rect = boardRef.current.getBoundingClientRect();
        boardBoundsRef.current = rect;
      }
      if (!rect || rect.width === 0 || rect.height === 0) return null;

      const cellSize = rect.width / 8;

      // Position the piece centered around touch point with vertical offset for mobile fingers
      const targetX = clientX - (piece.width * cellSize) / 2;
      const targetY = clientY - (piece.height * cellSize) / 2 - (piece.height > 1 ? cellSize * 0.6 : 0);

      const col = Math.round((targetX - rect.left) / cellSize);
      const row = Math.round((targetY - rect.top) / cellSize);

      return { row, col };
    },
    [boardRef]
  );

  const startDrag = useCallback(
    (e: React.PointerEvent, pieceIndex: number, piece: Piece) => {
      e.stopPropagation();
      e.preventDefault();

      updateCachedBounds();

      const soundEnabled = useGameStore.getState().settings.soundEnabled;
      const vibrationEnabled = useGameStore.getState().settings.vibrationEnabled;

      audioService.playPickup(soundEnabled);
      hapticService.vibratePickup(vibrationEnabled);

      const clientX = e.clientX;
      const clientY = e.clientY;
      const boardPos = calculateBoardPosition(clientX, clientY, piece);
      const currentBoard = useGameStore.getState().board;

      const isValid = boardPos
        ? canPlacePiece(currentBoard, piece, boardPos)
        : false;

      const predicted = isValid && boardPos
        ? getPreviewCompletedLines(currentBoard, piece, boardPos)
        : { rows: [], cols: [] };

      const nextSession: DragSession = {
        isDragging: true,
        pieceIndex,
        piece,
        dragPos: { x: clientX, y: clientY },
        hoverBoardPos: boardPos,
        isValidPlacement: isValid,
        previewCompletedLines: predicted,
      };

      setDragSession(nextSession);
    },
    [calculateBoardPosition, updateCachedBounds]
  );

  // Global window event listeners during active drag
  useEffect(() => {
    if (!dragSession.isDragging) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      const session = dragSessionRef.current;
      if (!session.isDragging || !session.piece) return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      // Guard against synthetic/zero events
      if (clientX <= 0 && clientY <= 0) return;

      const piece = session.piece;
      const boardPos = calculateBoardPosition(clientX, clientY, piece);
      const currentBoard = useGameStore.getState().board;

      const isValid = boardPos
        ? canPlacePiece(currentBoard, piece, boardPos)
        : false;

      const predicted = isValid && boardPos
        ? getPreviewCompletedLines(currentBoard, piece, boardPos)
        : { rows: [], cols: [] };

      setDragSession((prev) => ({
        ...prev,
        dragPos: { x: clientX, y: clientY },
        hoverBoardPos: boardPos,
        isValidPlacement: isValid,
        previewCompletedLines: predicted,
      }));
    };

    const handleWindowPointerUp = () => {
      const session = dragSessionRef.current;
      if (!session.isDragging) return;

      if (
        session.pieceIndex !== null &&
        session.piece &&
        session.hoverBoardPos &&
        session.isValidPlacement
      ) {
        // Place piece
        useGameStore.getState().placePieceAction(session.pieceIndex, session.hoverBoardPos);
      }

      // Reset
      setDragSession({
        isDragging: false,
        pieceIndex: null,
        piece: null,
        dragPos: null,
        hoverBoardPos: null,
        isValidPlacement: false,
        previewCompletedLines: { rows: [], cols: [] },
      });
    };

    window.addEventListener('pointermove', handleWindowPointerMove, { passive: true });
    window.addEventListener('pointerup', handleWindowPointerUp, { passive: true });
    window.addEventListener('pointercancel', handleWindowPointerUp, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowPointerUp);
    };
  }, [dragSession.isDragging, calculateBoardPosition]);

  return {
    dragSession,
    startDrag,
  };
}

