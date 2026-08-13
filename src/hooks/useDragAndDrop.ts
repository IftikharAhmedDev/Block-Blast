import { useState, useRef, useCallback, useEffect } from 'react';
import { Piece, Position } from '../types/game';
import { canPlacePiece } from '../engine/board';
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
}

export function useDragAndDrop(boardRef: React.RefObject<HTMLDivElement | null>) {
  const [dragSession, setDragSession] = useState<DragSession>({
    isDragging: false,
    pieceIndex: null,
    piece: null,
    dragPos: null,
    hoverBoardPos: null,
    isValidPlacement: false,
  });

  const boardBoundsRef = useRef<DOMRect | null>(null);
  const dragSessionRef = useRef<DragSession>(dragSession);

  // Synchronize ref for instant access inside high-frequency pointer event listeners
  useEffect(() => {
    dragSessionRef.current = dragSession;
  }, [dragSession]);

  /**
   * Recalculates cached board dimensions to prevent layout thrashing on pointermove.
   */
  const updateCachedBounds = useCallback(() => {
    if (boardRef.current) {
      boardBoundsRef.current = boardRef.current.getBoundingClientRect();
    }
  }, [boardRef]);

  // Recalculate bounds on window resize or scroll
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

      // Position the piece centered around touch point with vertical offset for visibility
      const targetX = clientX - (piece.width * cellSize) / 2;
      const targetY = clientY - (piece.height * cellSize) / 2 - (piece.height > 1 ? cellSize * 0.5 : 0);

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

      // Pointer capture for robust touch/mouse tracking
      const target = e.currentTarget as HTMLElement;
      if (target.setPointerCapture) {
        try {
          target.setPointerCapture(e.pointerId);
        } catch {
          // Ignore
        }
      }

      // Cache fresh board bounds at drag start
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

      const nextSession: DragSession = {
        isDragging: true,
        pieceIndex,
        piece,
        dragPos: { x: clientX, y: clientY },
        hoverBoardPos: boardPos,
        isValidPlacement: isValid,
      };

      setDragSession(nextSession);
    },
    [calculateBoardPosition, updateCachedBounds]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const session = dragSessionRef.current;
      if (!session.isDragging || !session.piece) return;

      const piece = session.piece;
      const clientX = e.clientX;
      const clientY = e.clientY;

      const boardPos = calculateBoardPosition(clientX, clientY, piece);
      const currentBoard = useGameStore.getState().board;

      const isValid = boardPos
        ? canPlacePiece(currentBoard, piece, boardPos)
        : false;

      const prevPos = session.hoverBoardPos;
      const isPosChanged =
        !prevPos ||
        !boardPos ||
        prevPos.row !== boardPos.row ||
        prevPos.col !== boardPos.col;

      const isValidityChanged = session.isValidPlacement !== isValid;

      if (
        isPosChanged ||
        isValidityChanged ||
        session.dragPos?.x !== clientX ||
        session.dragPos?.y !== clientY
      ) {
        setDragSession({
          isDragging: true,
          pieceIndex: session.pieceIndex,
          piece: session.piece,
          dragPos: { x: clientX, y: clientY },
          hoverBoardPos: boardPos,
          isValidPlacement: isValid,
        });
      }
    },
    [calculateBoardPosition]
  );

  const endDrag = useCallback((e: React.PointerEvent) => {
    const session = dragSessionRef.current;
    if (!session.isDragging) return;

    const target = e.currentTarget as HTMLElement;
    if (target.releasePointerCapture) {
      try {
        target.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }

    if (
      session.pieceIndex !== null &&
      session.piece &&
      session.hoverBoardPos &&
      session.isValidPlacement
    ) {
      // Commit placement to Zustand store
      useGameStore.getState().placePieceAction(session.pieceIndex, session.hoverBoardPos);
    }

    // Reset drag session
    setDragSession({
      isDragging: false,
      pieceIndex: null,
      piece: null,
      dragPos: null,
      hoverBoardPos: null,
      isValidPlacement: false,
    });
  }, []);

  return {
    dragSession,
    startDrag,
    onPointerMove,
    endDrag,
  };
}
