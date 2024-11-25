// useZoom.ts
import { useEdgify } from '@/features/context/EdgifyContext';

export const useZoom = () => {
  const { updateZoom, state } = useEdgify();
  const zoom = state.history.present.viewport.zoom;

  const handleZoom = (delta: number) => {
    const newZoom = zoom + delta * 0.1;
    updateZoom(newZoom);
  };

  return { zoom, handleZoom };
};
