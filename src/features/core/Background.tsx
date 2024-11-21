import React from 'react';
import { useEdgify } from '@/features/context/EdgifyContext';

export const Background: React.FC = () => {
  const { state } = useEdgify();
  const { zoom } = state.viewport;

  return (
    <svg className='absolute inset-0 w-full h-full -z-10'>
      <pattern id='grid' width={40 * zoom} height={40 * zoom} patternUnits='userSpaceOnUse'>
        <path d={`M ${40 * zoom} 0 L 0 0 0 ${40 * zoom}`} fill='none' stroke='#e0e0e0' strokeWidth='1' />
      </pattern>
      <rect width='100%' height='100%' fill='url(#grid)' />
    </svg>
  );
};
