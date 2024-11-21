import { useCallback } from 'react';
import { Position } from '@/shared/types/core';
import { useEdgify } from '@/features/context/EdgifyContext';

export const useDragAndDrop = () => {
  const { updateNodePosition } = useEdgify();

  const handleDrag = useCallback(
    (nodeId: string, position: Position) => {
      updateNodePosition(nodeId, position);
    },
    [updateNodePosition],
  );

  return { handleDrag };
};
