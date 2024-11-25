import { useEffect } from 'react';
import { useEdgify } from '@/features/context/EdgifyContext';

export const useKeyboardShortcuts = () => {
  const { dispatch, state, undo, redo } = useEdgify();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          // Redo when Shift is held
          redo();
        } else {
          // Undo
          undo();
        }
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedNodes = state.history.present.selectedNodes;
        const selectedEdges = state.history.present.selectedEdges;

        // Remove selected nodes
        selectedNodes.forEach((nodeId) => {
          dispatch({
            type: 'REMOVE_NODE',
            payload: nodeId,
          });
        });

        // Remove selected edges
        selectedEdges.forEach((edgeId) => {
          dispatch({
            type: 'REMOVE_EDGE',
            payload: edgeId,
          });
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, state.history.present.selectedNodes, state.history.present.selectedEdges, undo, redo]);
};
