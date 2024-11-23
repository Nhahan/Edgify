import { useEffect } from 'react';
import { useEdgify } from '@/features/context/EdgifyContext';

export const useKeyboardShortcuts = () => {
  const { dispatch, state } = useEdgify();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // remove selected node
        state.selectedNodes.forEach((nodeId) => {
          dispatch({
            type: 'REMOVE_NODE',
            payload: nodeId,
          });
        });

        // remove selected edge
        state.selectedEdges.forEach((edgeId) => {
          dispatch({
            type: 'REMOVE_EDGE',
            payload: edgeId,
          });
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, state.selectedNodes, state.selectedEdges]);
};
