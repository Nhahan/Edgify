import React from 'react';
import { useEdgify } from '@/features/context/EdgifyContext';

interface BackgroundProps {
  width: number;
  height: number;
}

export const Background: React.FC<BackgroundProps> = ({ width, height }) => {
  const { state } = useEdgify();
  const zoom = state.history.present.viewport.zoom;

  return (
    <svg
      id='Background'
      className='absolute inset-0 -z-10'
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio='none'
    >
      <defs>
        <pattern id='smallGrid' width={10 * zoom} height={10 * zoom} patternUnits='userSpaceOnUse'>
          <path
            d={`M ${10 * zoom} 0 L 0 0 0 ${10 * zoom}`}
            fill='none'
            stroke='#e0e0e0'
            strokeWidth='0.5'
            opacity='0.3'
          />
        </pattern>
        <pattern id='grid' width={100 * zoom} height={100 * zoom} patternUnits='userSpaceOnUse'>
          <rect width={100 * zoom} height={100 * zoom} fill='url(#smallGrid)' />
          <path
            d={`M ${100 * zoom} 0 L 0 0 0 ${100 * zoom}`}
            fill='none'
            stroke='#d0d0d0'
            strokeWidth='1'
            opacity='0.2'
          />
        </pattern>
      </defs>
      <rect width={width} height={height} fill='url(#grid)' />
    </svg>
  );
};
