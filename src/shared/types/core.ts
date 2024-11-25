// types.ts (or core.ts)

export type Position = {
  x: number;
  y: number;
};

export type Dimensions = {
  width: number;
  height: number;
};

export type HandleData = {
  id: string;
  nodeId: string;
  type: 'input' | 'output';
  position: Position;
};

export type NodeData = {
  id: string;
  type: string;
  position: Position;
  dimensions: Dimensions;
  inputs: HandleData[];
  outputs: HandleData[];
  data?: Record<string, unknown>;
};

export type EdgeData = {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  type?: string;
  color?: string;
};

export type ViewportState = {
  zoom: number;
  position: Position;
};

export type EdgePreviewData = {
  sourceNodeId: string;
  sourceHandleId: string;
  fromPosition: Position;
  toPosition: Position;
};

export type EdgifyState = {
  nodes: NodeData[];
  edges: EdgeData[];
  selectedNodes: string[];
  selectedEdges: string[];
  viewport: ViewportState;
  previewInputs: Record<string, HandleData>;
  edgePreview: EdgePreviewData | null;
};

export type HistoryState = {
  past: EdgifyState[];
  present: EdgifyState;
  future: EdgifyState[];
};

export type StoreState = {
  history: HistoryState;
};

export type ActionType =
  | { type: 'ADD_NODE'; payload: NodeData }
  | { type: 'REMOVE_NODE'; payload: string }
  | { type: 'ADD_EDGE'; payload: EdgeData }
  | { type: 'REMOVE_EDGE'; payload: string }
  | { type: 'UPDATE_NODE_POSITION'; payload: { nodeId: string; position: Position } }
  | { type: 'UPDATE_NODE'; payload: NodeData }
  | { type: 'UPDATE_ZOOM'; payload: number }
  | { type: 'SELECT_NODE'; payload: string }
  | { type: 'SELECT_EDGE'; payload: string }
  | { type: 'START_EDGE_PREVIEW'; payload: EdgePreviewData }
  | { type: 'UPDATE_EDGE_PREVIEW'; payload: Position }
  | { type: 'END_EDGE_PREVIEW' }
  | { type: 'UNDO' }
  | { type: 'REDO' };

export type NodeResizeCursorType =
  | 'ne-resize'
  | 'nw-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'n-resize'
  | 'w-resize'
  | 'e-resize'
  | 's-resize'
  | 'move';
