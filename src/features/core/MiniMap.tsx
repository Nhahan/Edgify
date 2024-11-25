import React from 'react';
import { useEdgify } from '@/features/context/EdgifyContext';

interface MiniMapProps {
  width: number;
  height: number;
}

export const MiniMap: React.FC<MiniMapProps> = ({ width, height }) => {
  const { state } = useEdgify();
  const edgifyState = state.history.present; // Access the present state
  const { nodes } = edgifyState;

  // calculate the aspect ratio of the viewport of the mini map
  const aspectRatio = width / height;
  const miniMapWidth = 192; // 48 * 4
  const miniMapHeight = miniMapWidth / aspectRatio;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const container = document.querySelector('.relative.overflow-auto.w-full.h-screen') as HTMLElement;
    if (!container) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const scrollX = (clickX / miniMapWidth) * width - container.clientWidth / 2;
    const scrollY = (clickY / miniMapHeight) * height - container.clientHeight / 2;

    container.scrollLeft = scrollX;
    container.scrollTop = scrollY;
  };

  return (
    <div
      id='MiniMap'
      className='fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 z-30'
      style={{
        width: `${miniMapWidth}px`,
        height: `${miniMapHeight}px`,
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <svg width='100%' height='100%' viewBox={`0 0 ${width} ${height}`} preserveAspectRatio='xMidYMid meet'>
        {nodes.map((node) => (
          <rect
            key={node.id}
            x={node.position.x}
            y={node.position.y}
            width={node.dimensions.width}
            height={node.dimensions.height}
            fill='#b1b1b7'
          />
        ))}
      </svg>
    </div>
  );
};
