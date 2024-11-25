// reducer.ts

import { ActionType, EdgeData, EdgifyState, NodeData, StoreState } from '@/shared/types/core';

export const edgifyReducer = (state: StoreState, action: ActionType): StoreState => {
  try {
    switch (action.type) {
      case 'UNDO': {
        const { past, present, future } = state.history;
        if (past.length === 0) return state;

        const previous = past[past.length - 1];
        const newPast = past.slice(0, -1);
        const newFuture = [present, ...future];

        return {
          history: {
            past: newPast,
            present: previous,
            future: newFuture,
          },
        };
      }

      case 'REDO': {
        const { past, present, future } = state.history;
        if (future.length === 0) return state;

        const next = future[0];
        const newFuture = future.slice(1);
        const newPast = [...past, present];

        return {
          history: {
            past: newPast,
            present: next,
            future: newFuture,
          },
        };
      }

      default: {
        const newPresent = presentStateReducer(state.history.present, action);
        if (newPresent === state.history.present) {
          // No changes detected
          return state;
        }
        return {
          history: {
            past: [...state.history.past, state.history.present],
            present: newPresent,
            future: [],
          },
        };
      }
    }
  } catch (error) {
    console.error('Error in reducer:', error);
    return state; // Return current state in case of error
  }
};

const presentStateReducer = (state: EdgifyState, action: ActionType): EdgifyState => {
  switch (action.type) {
    case 'SELECT_NODE': {
      return {
        ...state,
        selectedNodes: [action.payload],
        selectedEdges: [],
      };
    }

    case 'SELECT_EDGE': {
      return {
        ...state,
        selectedEdges: [action.payload],
        selectedNodes: [],
      };
    }

    case 'START_EDGE_PREVIEW': {
      return {
        ...state,
        edgePreview: action.payload,
      };
    }

    case 'UPDATE_EDGE_PREVIEW': {
      if (!state.edgePreview) return state;
      return {
        ...state,
        edgePreview: {
          ...state.edgePreview,
          toPosition: action.payload,
        },
      };
    }

    case 'END_EDGE_PREVIEW': {
      return {
        ...state,
        edgePreview: null,
      };
    }

    case 'ADD_NODE': {
      const error = validateNode(action.payload);
      if (error) {
        console.error('Invalid node:', error);
        return state;
      }

      const isDuplicate = state.nodes.some((node) => node.id === action.payload.id);
      if (isDuplicate) {
        console.error(`Node with ID ${action.payload.id} already exists`);
        return state;
      }

      return {
        ...state,
        nodes: [...state.nodes, action.payload],
      };
    }

    case 'REMOVE_NODE': {
      const nodeExists = state.nodes.some((node) => node.id === action.payload);
      if (!nodeExists) {
        console.error(`Node with ID ${action.payload} does not exist`);
        return state;
      }

      return {
        ...state,
        nodes: state.nodes.filter((node) => node.id !== action.payload),
        edges: state.edges.filter((edge) => edge.source !== action.payload && edge.target !== action.payload),
      };
    }

    case 'UPDATE_NODE': {
      const error = validateNode(action.payload);
      if (error) {
        console.error('Invalid node update:', error);
        return state;
      }

      const nodeExists = state.nodes.some((node) => node.id === action.payload.id);
      if (!nodeExists) {
        console.error(`Node with ID ${action.payload.id} does not exist`);
        return state;
      }

      return {
        ...state,
        nodes: state.nodes.map((node) => (node.id === action.payload.id ? action.payload : node)),
      };
    }

    case 'UPDATE_NODE_POSITION': {
      const nodeIndex = state.nodes.findIndex((node) => node.id === action.payload.nodeId);
      if (nodeIndex === -1) {
        console.error(`Node with ID ${action.payload.nodeId} does not exist`);
        return state;
      }

      const updatedNodes = [...state.nodes];
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        position: action.payload.position,
      };

      return {
        ...state,
        nodes: updatedNodes,
      };
    }

    case 'UPDATE_ZOOM': {
      const newZoom = Math.min(Math.max(action.payload, 0.1), 2);
      if (newZoom === state.viewport.zoom) return state;

      return {
        ...state,
        viewport: {
          ...state.viewport,
          zoom: newZoom,
        },
      };
    }

    case 'ADD_EDGE': {
      const error = validateEdge(action.payload, state.nodes);
      if (error) {
        console.error('Invalid edge:', error);
        return state;
      }

      const isDuplicate = state.edges.some((edge) => edge.id === action.payload.id);
      if (isDuplicate) {
        console.error(`Edge with ID ${action.payload.id} already exists`);
        return state;
      }

      const duplicateConnection = state.edges.some(
        (edge) =>
          edge.source === action.payload.source &&
          edge.target === action.payload.target &&
          edge.sourceHandle === action.payload.sourceHandle &&
          edge.targetHandle === action.payload.targetHandle,
      );
      if (duplicateConnection) {
        console.error('This connection already exists');
        return state;
      }

      return {
        ...state,
        edges: [...state.edges, action.payload],
        edgePreview: null, // Clear edge preview after adding edge
      };
    }

    case 'REMOVE_EDGE': {
      const edgeExists = state.edges.some((edge) => edge.id === action.payload);
      if (!edgeExists) {
        console.error(`Edge with ID ${action.payload} does not exist`);
        return state;
      }

      return {
        ...state,
        edges: state.edges.filter((edge) => edge.id !== action.payload),
      };
    }

    default:
      return state;
  }
};

const validateNode = (node: NodeData): string | null => {
  if (!node.id) return 'Node ID is required';
  if (!node.position) return 'Node position is required';
  if (!node.dimensions) return 'Node dimensions are required';
  return null;
};

const validateEdge = (edge: EdgeData, nodes: NodeData[]): string | null => {
  if (!edge.id) return 'Edge ID is required';
  if (!edge.source || !edge.target) return 'Edge source and target are required';
  if (!edge.sourceHandle || !edge.targetHandle) return 'Edge handles are required';

  const sourceExists = nodes.some((node) => node.id === edge.source);
  const targetExists = nodes.some((node) => node.id === edge.target);

  if (!sourceExists) return `Source node ${edge.source} does not exist`;
  if (!targetExists) return `Target node ${edge.target} does not exist`;

  return null;
};
