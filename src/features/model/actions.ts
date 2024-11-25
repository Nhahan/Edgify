import { Dispatch } from 'react';
import { ActionType, EdgeData, NodeData, Position, EdgePreviewData } from '@/shared/types/core';

export const createActions = (dispatch: Dispatch<ActionType>) => ({
  addNode: (node: Omit<NodeData, 'id'>) => {
    dispatch({
      type: 'ADD_NODE',
      payload: { ...node, id: `node-${Date.now()}` },
    });
  },

  removeNode: (nodeId: string) => {
    dispatch({
      type: 'REMOVE_NODE',
      payload: nodeId,
    });
  },

  addEdge: (edge: Omit<EdgeData, 'id'>) => {
    dispatch({
      type: 'ADD_EDGE',
      payload: { ...edge, id: `edge-${Date.now()}` },
    });
  },

  removeEdge: (edgeId: string) => {
    dispatch({
      type: 'REMOVE_EDGE',
      payload: edgeId,
    });
  },

  updateNode: (node: NodeData) => {
    dispatch({
      type: 'UPDATE_NODE',
      payload: node,
    });
  },

  updateNodePosition: (nodeId: string, position: Position) => {
    dispatch({
      type: 'UPDATE_NODE_POSITION',
      payload: { nodeId, position },
    });
  },

  updateZoom: (zoom: number) => {
    dispatch({
      type: 'UPDATE_ZOOM',
      payload: zoom,
    });
  },

  selectNode: (nodeId: string) => {
    dispatch({
      type: 'SELECT_NODE',
      payload: nodeId,
    });
  },

  selectEdge: (edgeId: string) => {
    dispatch({
      type: 'SELECT_EDGE',
      payload: edgeId,
    });
  },

  startEdgePreview: (previewData: EdgePreviewData) => {
    dispatch({
      type: 'START_EDGE_PREVIEW',
      payload: previewData,
    });
  },

  updateEdgePreview: (position: Position) => {
    dispatch({
      type: 'UPDATE_EDGE_PREVIEW',
      payload: position,
    });
  },

  endEdgePreview: () => {
    dispatch({ type: 'END_EDGE_PREVIEW' });
  },

  undo: () => {
    dispatch({ type: 'UNDO' });
  },

  redo: () => {
    dispatch({ type: 'REDO' });
  },
});
