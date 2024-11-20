import { NodeData, EdgeData } from '@/shared/types/edgify.types';

interface HistoryState {
  nodes: NodeData[];
  edges: EdgeData[];
}

export class HistoryManager {
  private undoStack: HistoryState[] = [];
  private redoStack: HistoryState[] = [];
  private readonly maxSize: number;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  push(state: HistoryState) {
    this.undoStack.push({ ...state });
    this.redoStack = [];

    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }
  }

  undo(currentState: HistoryState): HistoryState | null {
    if (this.undoStack.length === 0) return null;

    const prevState = this.undoStack.pop()!;
    this.redoStack.push({ ...currentState });
    return prevState;
  }

  redo(currentState: HistoryState): HistoryState | null {
    if (this.redoStack.length === 0) return null;

    const nextState = this.redoStack.pop()!;
    this.undoStack.push({ ...currentState });
    return nextState;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }
}
