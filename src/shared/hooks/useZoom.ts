import { useCallback } from 'react';
import { useEdgify } from '@/features/context/EdgifyContext';

export const useZoom = () => {
  const { state, updateZoom } = useEdgify();
  const { zoom } = state.viewport;

  const handleZoom = useCallback(
    (delta: number) => {
      const newZoom = Math.max(0.1, Math.min(2, zoom + delta * 0.1));
      updateZoom(newZoom);
    },
    [zoom, updateZoom],
  );

  return { zoom, handleZoom };
};
