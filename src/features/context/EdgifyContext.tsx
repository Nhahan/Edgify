// EdgifyContext.tsx
import React, { createContext, useContext } from 'react';
import { ActionType, EdgeData, EdgePreviewData, NodeData, Position, StoreState } from '@/shared/types/core';

export const EdgifyContext = createContext<{
  state: StoreState;
  dispatch: React.Dispatch<ActionType>;
  addNode: (node: Omit<NodeData, 'id'>) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: Omit<EdgeData, 'id'>) => void;
  removeEdge: (edgeId: string) => void;
  updateNode: (node: NodeData) => void;
  updateNodePosition: (nodeId: string, position: Position) => void;
  updateZoom: (zoom: number) => void;
  selectNode: (nodeId: string) => void;
  selectEdge: (edgeId: string) => void;
  startEdgePreview: (previewData: EdgePreviewData) => void;
  updateEdgePreview: (position: Position) => void;
  endEdgePreview: () => void;
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
