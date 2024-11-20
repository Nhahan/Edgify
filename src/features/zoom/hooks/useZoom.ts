import { useCallback } from 'react';
import { useEdgify } from '@/app/providers/EdgifyProvider';

export const useZoom = () => {
  const { state, dispatch } = useEdgify();
  const { scale } = state;

  const handleZoom = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();

      const delta = event.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(scale * delta, 0.1), 2);

      dispatch({
        type: 'SET_ZOOM',
        payload: newScale,
      });

      // 줌 중심점 조정을 위한 위치 업데이트
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      const deltaX = (mouseX / scale) * (1 - delta);
      const deltaY = (mouseY / scale) * (1 - delta);

      dispatch({
        type: 'SET_POSITION',
        payload: {
          x: state.position.x + deltaX,
          y: state.position.y + deltaY,
        },
      });
    },
    [scale, state.position],
  );

  const handlePan = useCallback(
    (dx: number, dy: number) => {
      dispatch({
        type: 'SET_POSITION',
        payload: {
          x: state.position.x + dx / scale,
          y: state.position.y + dy / scale,
        },
      });
    },
    [scale, state.position],
  );

  return { handleZoom, handlePan };
};
