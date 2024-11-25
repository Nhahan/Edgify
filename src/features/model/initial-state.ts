// initial-state.ts

import { EdgifyState, HistoryState, StoreState } from '@/shared/types/core';

export const createInitialState = (): StoreState => {
  const initialEdgifyState: EdgifyState = {
    nodes: [],
    edges: [],
    selectedNodes: [],
    selectedEdges: [],
    viewport: {
      zoom: 1,
      position: { x: 0, y: 0 },
    },
    previewInputs: {},
    edgePreview: null,
  };

  const initialHistoryState: HistoryState = {
    past: [],
    present: initialEdgifyState,
    future: [],
  };

  return {
    history: initialHistoryState,
  };
};
