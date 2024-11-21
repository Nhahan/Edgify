import React, { createContext, useContext } from 'react';
import { ActionType, EdgeData, EdgifyState, NodeData, Position } from '@/shared/types/core';

export const EdgifyContext = createContext<{
  state: EdgifyState;
  dispatch: React.Dispatch<ActionType>;
  addNode: (node: Omit<NodeData, 'id'>) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: Omit<EdgeData, 'id'>) => void;
  removeEdge: (edgeId: string) => void;
  updateNodePosition: (nodeId: string, position: Position) => void;
  updateZoom: (zoom: number) => void;
  undo: () => void;
  redo: () => void;
} | null>(null);

export const useEdgify = () => {
  const context = useContext(EdgifyContext);
  if (!context) {
    throw new Error('useEdgify must be used within an EdgifyProvider');
  }
  return context;
};
