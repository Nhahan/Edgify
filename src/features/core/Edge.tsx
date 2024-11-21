import React from 'react';
import { EdgeData } from '@/shared/types/core';

interface EdgeProps {
  data: EdgeData;
  onSelect?: (edgeId: string) => void;
}

export const Edge: React.FC<EdgeProps> = ({ data, onSelect }) => {
  const { source, target } = data;

  // Calculate path using source and target positions
  const path = `M ${source} C ${source} ${target}`;

  return (
    <path
      id={Edge + data.id}
      d={path}
      stroke='#b1b1b7'
      strokeWidth={2}
      fill='none'
      className='transition-colors hover:stroke-blue-500'
      onClick={() => onSelect?.(data.id)}
    />
  );
};
