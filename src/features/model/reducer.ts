import { ActionType, EdgeData, EdgifyState, HandleData, HistoryState, NodeData } from '@/shared/types/core';

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

const addToHistory = (
  state: EdgifyState & { history: HistoryState },
  nextState: EdgifyState,
): EdgifyState & { history: HistoryState } => {
  // check if state has changed
  const hasChanged = JSON.stringify(state) !== JSON.stringify(nextState);
  if (!hasChanged) return state;

  return {
    ...nextState,
    history: {
      past: [...state.history.past, state.history.present],
      present: {
        nodes: nextState.nodes,
        edges: nextState.edges,
        selectedNodes: nextState.selectedNodes,
        selectedEdges: nextState.selectedEdges,
        viewport: nextState.viewport,
        previewInputs: nextState.previewInputs,
      },
      future: [],
    },
  };
};

export const edgifyReducer = (
  state: EdgifyState & { history: HistoryState },
  action: ActionType,
): EdgifyState & { history: HistoryState } => {
  try {
    switch (action.type) {
      case 'SELECT_NODE': {
        return {
          ...state,
          selectedNodes: [action.payload],
          selectedEdges: [], // deselect edges when selecting a node
        };
      }
      case 'SELECT_EDGE': {
        return {
          ...state,
          selectedEdges: [action.payload],
          selectedNodes: [], // deselect nodes when selecting an edge
        };
      }
      case 'ADD_PREVIEW_INPUT': {
        const targetNode = state.nodes.find((node) => node.id === action.payload.nodeId);
        if (!targetNode) return state;

        const previewInput: HandleData = {
          id: `preview-${Date.now()}`,
          nodeId: targetNode.id,
          type: 'input',
          position: {
            x: 0,
            y: (targetNode.inputs.length + 1) * 30,
          },
        };

        return {
          ...state,
          previewInputs: {
            ...state.previewInputs,
            [targetNode.id]: previewInput,
          },
        };
      }
      case 'REMOVE_PREVIEW_INPUT': {
        const previews = { ...state.previewInputs };
        delete previews[action.payload];
        return {
          ...state,
          previewInputs: previews,
        };
      }
      case 'UNDO': {
        if (state.history.past.length === 0) return state;
        const previous = state.history.past[state.history.past.length - 1];
        const newPast = state.history.past.slice(0, -1);
        return {
          ...state,
          ...previous,
          history: {
            past: newPast,
            present: previous,
            future: [state.history.present, ...state.history.future],
          },
        };
      }
      case 'REDO': {
        if (state.history.future.length === 0) return state;
        const next = state.history.future[0];
        const newFuture = state.history.future.slice(1);
        return {
          ...state,
          ...next,
          history: {
            past: [...state.history.past, state.history.present],
            present: next,
            future: newFuture,
          },
        };
      }
      case 'ADD_NODE':
      case 'REMOVE_NODE':
      case 'ADD_EDGE':
      case 'REMOVE_EDGE':
      case 'UPDATE_NODE':
      case 'UPDATE_NODE_POSITION':
      case 'UPDATE_ZOOM':
        const updatedState = handleStateUpdate(state, action);
        if (!updatedState) return state; // if state update failed
        return addToHistory(state, updatedState);

      default:
        return state;
    }
  } catch (error) {
    console.error('Error in reducer:', error);
    return state; // maintain current state in case of error
  }
};

const handleStateUpdate = (state: EdgifyState, action: ActionType): EdgifyState | null => {
  switch (action.type) {
    case 'ADD_NODE': {
      const error = validateNode(action.payload);
      if (error) {
        console.error('Invalid node:', error);
        return null;
      }

      const isDuplicate = state.nodes.some((node) => node.id === action.payload.id);
      if (isDuplicate) {
        console.error(`Node with ID ${action.payload.id} already exists`);
        return null;
      }

      return {
        ...state,
        nodes: [...state.nodes, action.payload],
      };
    }

    case 'ADD_EDGE': {
      const error = validateEdge(action.payload, state.nodes);
      if (error) {
        console.error('Invalid edge:', error);
        return null;
      }

      const isDuplicate = state.edges.some((edge) => edge.id === action.payload.id);
      if (isDuplicate) {
        console.error(`Edge with ID ${action.payload.id} already exists`);
        return null;
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
        return null;
      }

      // find target node and add new input
      const targetNode = state.nodes.find((node) => node.id === action.payload.target);
      if (!targetNode) return null;

      const newInput: HandleData = {
        id: action.payload.targetHandle,
        nodeId: targetNode.id,
        type: 'input',
        position: {
          x: 0,
          y: (targetNode.inputs.length + 1) * 30,
        },
      };

      // update target node with new input and add edge
      return {
        ...state,
        nodes: state.nodes.map((node) =>
          node.id === targetNode.id ? { ...node, inputs: [...node.inputs, newInput] } : node,
        ),
        edges: [...state.edges, action.payload],
        previewInputs: {}, // clear any preview inputs
      };
    }
    case 'REMOVE_NODE': {
      const nodeExists = state.nodes.some((node) => node.id === action.payload);
      if (!nodeExists) {
        console.error(`Node with ID ${action.payload} does not exist`);
        return null;
      }

      return {
        ...state,
        nodes: state.nodes.filter((node) => node.id !== action.payload),
        edges: state.edges.filter((edge) => edge.source !== action.payload && edge.target !== action.payload),
      };
    }

    case 'REMOVE_EDGE': {
      const edgeExists = state.edges.some((edge) => edge.id === action.payload);
      if (!edgeExists) {
        console.error(`Edge with ID ${action.payload} does not exist`);
        return null;
      }

      return {
        ...state,
        edges: state.edges.filter((edge) => edge.id !== action.payload),
      };
    }

    case 'UPDATE_NODE': {
      const error = validateNode(action.payload);
      if (error) {
        console.error('Invalid node update:', error);
        return null;
      }

      const nodeExists = state.nodes.some((node) => node.id === action.payload.id);
      if (!nodeExists) {
        console.error(`Node with ID ${action.payload.id} does not exist`);
        return null;
      }

      return {
        ...state,
        nodes: state.nodes.map((node) => (node.id === action.payload.id ? action.payload : node)),
      };
    }

    case 'UPDATE_NODE_POSITION': {
      const nodeExists = state.nodes.some((node) => node.id === action.payload.nodeId);
      if (!nodeExists) {
        console.error(`Node with ID ${action.payload.nodeId} does not exist`);
        return null;
      }

      return {
        ...state,
        nodes: state.nodes.map((node) =>
          node.id === action.payload.nodeId ? { ...node, position: action.payload.position } : node,
        ),
      };
    }

    case 'UPDATE_ZOOM': {
      const newZoom = Math.min(Math.max(action.payload, 0.1), 2);
      if (newZoom === state.viewport.zoom) return null;

      return {
        ...state,
        viewport: {
          ...state.viewport,
          zoom: newZoom,
        },
      };
    }

    default:
      return state;
  }
};
