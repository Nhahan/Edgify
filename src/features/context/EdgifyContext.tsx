import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { EdgifyState, NodeData, EdgeData, Position, ActionType } from '@/shared/types/core';
import { createInitialState } from '../model/initial-state';
import { edgifyReducer } from '../model/reducer';
import { createActions } from '../model/actions';

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

export const EdgifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(edgifyReducer, createInitialState());
  const actions = createActions(dispatch);

  return (
    <EdgifyContext.Provider
      value={{
        state,
        dispatch,
        ...actions,
      }}
    >
      {children}
    </EdgifyContext.Provider>
  );
};

export const useEdgify = () => {
  const context = useContext(EdgifyContext);
  if (!context) {
    throw new Error('useEdgify must be used within an EdgifyProvider');
  }
  return context;
};
