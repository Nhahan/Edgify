export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface InputHandle {
  id: string;
  label?: string;
}

export interface OutputHandle {
  id: string;
  label?: string;
}

export interface NodeData {
  id: string;
  type: string;
  position: Position;
  size: Size;
  data: {
    label: string;
    description?: string;
    inputs: InputHandle[];
    outputs: OutputHandle[];
  };
  selected?: boolean;
}

export interface EdgeData {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  type?: 'straight' | 'bezier' | 'step';
  selected?: boolean;
  data?: any;
}

export interface EdgifyState {
  nodes: NodeData[];
  edges: EdgeData[];
  scale: number;
  position: Position;
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
  undoStack: { nodes: NodeData[]; edges: EdgeData[] }[];
  redoStack: { nodes: NodeData[]; edges: EdgeData[] }[];
}

export type EdgifyAction =
  | { type: 'SET_NODES'; payload: NodeData[] }
  | { type: 'SET_EDGES'; payload: EdgeData[] }
  | { type: 'UPDATE_NODE'; payload: { id: string; data: Partial<NodeData> } }
  | { type: 'UPDATE_EDGE'; payload: { id: string; data: Partial<EdgeData> } }
  | { type: 'ADD_EDGE'; payload: EdgeData }
  | { type: 'DELETE_NODE'; payload: string }
  | { type: 'DELETE_EDGE'; payload: string }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'SET_POSITION'; payload: Position }
  | { type: 'SELECT_NODE'; payload: string }
  | { type: 'SELECT_EDGE'; payload: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'AUTO_LAYOUT' };
