import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Background } from '@/shared/ui/Background';
import { useKeyboard } from '@/shared/hooks/useKeyboard';
import { layoutNodes } from '@/features/layout/lib/layoutAlgorithms';
import { EdgifyState, EdgifyAction } from '@/shared/types/edgify.types';
import { EdgeData, NodeData } from '@/shared/types/edgify.types';

const initialState: EdgifyState = {
  nodes: [],
  edges: [],
  scale: 1,
  position: { x: 0, y: 0 },
  selectedNodeIds: [],
  selectedEdgeIds: [],
  undoStack: [],
  redoStack: [],
};

const EdgifyContext = createContext<{
  state: EdgifyState;
  dispatch: React.Dispatch<EdgifyAction>;
  actions: {
    addNode: (node: NodeData) => void;
    addEdge: (edge: EdgeData) => void;
    updateNode: (id: string, data: Partial<NodeData>) => void;
    updateEdge: (id: string, data: Partial<EdgeData>) => void;
    deleteNode: (id: string) => void;
    deleteEdge: (id: string) => void;
    undo: () => void;
    redo: () => void;
    autoLayout: () => void;
  };
} | null>(null);

function edgifyReducer(state: EdgifyState, action: EdgifyAction): EdgifyState {
  switch (action.type) {
    case 'SET_NODES':
      return {
        ...state,
        nodes: action.payload,
        undoStack: [...state.undoStack, { nodes: state.nodes, edges: state.edges }],
        redoStack: [],
      };
    case 'SET_EDGES':
      return {
        ...state,
        edges: action.payload,
        undoStack: [...state.undoStack, { nodes: state.nodes, edges: state.edges }],
        redoStack: [],
      };
    case 'UPDATE_NODE':
      return {
        ...state,
        nodes: state.nodes.map((node) => (node.id === action.payload.id ? { ...node, ...action.payload.data } : node)),
      };
    case 'UPDATE_EDGE':
      return {
        ...state,
        edges: state.edges.map((edge) => (edge.id === action.payload.id ? { ...edge, ...action.payload.data } : edge)),
      };
    case 'DELETE_NODE':
      return {
        ...state,
        nodes: state.nodes.filter((node) => node.id !== action.payload),
        edges: state.edges.filter((edge) => edge.source !== action.payload && edge.target !== action.payload),
      };
    case 'DELETE_EDGE':
      return {
        ...state,
        edges: state.edges.filter((edge) => edge.id !== action.payload),
      };
    case 'SET_ZOOM':
      return { ...state, scale: action.payload };
    case 'SET_POSITION':
      return { ...state, position: action.payload };
    case 'SELECT_NODE':
      return {
        ...state,
        selectedNodeIds: [action.payload],
        selectedEdgeIds: [],
      };
    case 'SELECT_EDGE':
      return {
        ...state,
        selectedNodeIds: [],
        selectedEdgeIds: [action.payload],
      };
    case 'UNDO':
      if (state.undoStack.length === 0) return state;
      const prevState = state.undoStack[state.undoStack.length - 1];
      return {
        ...state,
        nodes: prevState.nodes,
        edges: prevState.edges,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, { nodes: state.nodes, edges: state.edges }],
      };
    case 'REDO':
      if (state.redoStack.length === 0) return state;
      const nextState = state.redoStack[state.redoStack.length - 1];
      return {
        ...state,
        nodes: nextState.nodes,
        edges: nextState.edges,
        undoStack: [...state.undoStack, { nodes: state.nodes, edges: state.edges }],
        redoStack: state.redoStack.slice(0, -1),
      };
    case 'AUTO_LAYOUT':
      return {
        ...state,
        nodes: layoutNodes(state.nodes, state.edges),
      };
    default:
      return state;
  }
}

export const EdgifyProvider: React.FC<{
  children: React.ReactNode;
  initialNodes?: NodeData[];
  initialEdges?: EdgeData[];
}> = ({ children, initialNodes = [], initialEdges = [] }) => {
  const [state, dispatch] = useReducer(edgifyReducer, {
    ...initialState,
    nodes: initialNodes,
    edges: initialEdges,
  });

  const actions = {
    addNode: useCallback(
      (node: NodeData) => {
        dispatch({ type: 'SET_NODES', payload: [...state.nodes, node] });
      },
      [state.nodes],
    ),

    addEdge: useCallback(
      (edge: EdgeData) => {
        dispatch({ type: 'SET_EDGES', payload: [...state.edges, edge] });
      },
      [state.edges],
    ),

    updateNode: useCallback((id: string, data: Partial<NodeData>) => {
      dispatch({ type: 'UPDATE_NODE', payload: { id, data } });
    }, []),

    updateEdge: useCallback((id: string, data: Partial<EdgeData>) => {
      dispatch({ type: 'UPDATE_EDGE', payload: { id, data } });
    }, []),

    deleteNode: useCallback((id: string) => {
      dispatch({ type: 'DELETE_NODE', payload: id });
    }, []),

    deleteEdge: useCallback((id: string) => {
      dispatch({ type: 'DELETE_EDGE', payload: id });
    }, []),

    undo: useCallback(() => {
      dispatch({ type: 'UNDO' });
    }, []),

    redo: useCallback(() => {
      dispatch({ type: 'REDO' });
    }, []),

    autoLayout: useCallback(() => {
      dispatch({ type: 'AUTO_LAYOUT' });
    }, []),
  };

  // Register keyboard shortcuts
  useKeyboard({
    'ctrl+z': actions.undo,
    'ctrl+y': actions.redo,
    'ctrl+l': actions.autoLayout,
    delete: () => {
      state.selectedNodeIds.forEach(actions.deleteNode);
      state.selectedEdgeIds.forEach(actions.deleteEdge);
    },
  });

  return (
    <EdgifyContext.Provider value={{ state, dispatch, actions }}>
      <div className='relative w-full h-full'>
        <Background />
        {children}
      </div>
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
