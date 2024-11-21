import { useEffect } from 'react';
import { useEdgify } from '@/features/context/EdgifyContext';

export const useKeyboardShortcuts = () => {
  const {
    undo,
    redo,
    removeNode,
    removeEdge,
    state: { selectedNodes, selectedEdges },
  } = useEdgify();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        selectedNodes.forEach((nodeId) => removeNode(nodeId));
        selectedEdges.forEach((edgeId) => removeEdge(edgeId));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, removeNode, removeEdge, selectedNodes, selectedEdges]);
};
