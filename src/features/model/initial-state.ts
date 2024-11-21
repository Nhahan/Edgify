import { EdgifyState, HistoryState } from '@/shared/types/core';

export const createInitialState = (): EdgifyState & { history: HistoryState } => ({
  nodes: [],
  edges: [],
  selectedNodes: [],
  selectedEdges: [],
  viewport: {
    zoom: 1,
    position: { x: 0, y: 0 },
  },
  history: {
    past: [],
    present: {
      nodes: [],
      edges: [],
      selectedNodes: [],
      selectedEdges: [],
      viewport: { zoom: 1, position: { x: 0, y: 0 } },
    },
    future: [],
  },
});
