import React from 'react';
import { useEdgify } from '@/features/context/EdgifyContext';

export const MiniMap: React.FC = () => {
  const { state } = useEdgify();
  const { nodes, viewport } = state;

  return (
    <div className='absolute bottom-4 right-4 w-48 h-48 bg-white rounded-lg shadow-lg p-2'>
      <svg width='100%' height='100%' viewBox='0 0 1000 1000'>
        {nodes.map((node) => (
          <rect
            key={node.id}
            x={node.position.x / viewport.zoom}
            y={node.position.y / viewport.zoom}
            width={node.dimensions.width / viewport.zoom}
            height={node.dimensions.height / viewport.zoom}
            fill='#b1b1b7'
          />
        ))}
      </svg>
    </div>
  );
};
