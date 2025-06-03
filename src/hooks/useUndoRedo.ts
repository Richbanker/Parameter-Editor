import { useCallback } from 'react';
import { HistoryEntry } from '../types/models';

interface UseUndoRedoProps {
  history: HistoryEntry[];
  currentIndex: number;
  onUndo: () => void;
  onRedo: () => void;
  maxHistoryLength?: number;
}

export const useUndoRedo = ({
  history,
  currentIndex,
  onUndo,
  onRedo,
  maxHistoryLength = 50
}: UseUndoRedoProps) => {
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const handleUndo = useCallback(() => {
    if (canUndo) {
      onUndo();
    }
  }, [canUndo, onUndo]);

  const handleRedo = useCallback(() => {
    if (canRedo) {
      onRedo();
    }
  }, [canRedo, onRedo]);

  const getHistorySlice = useCallback((start: number, end: number) => {
    return history.slice(start, end);
  }, [history]);

  return {
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
    getHistorySlice,
    currentHistoryIndex: currentIndex,
    historyLength: history.length
  };
}; 