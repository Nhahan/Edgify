import React from 'react';
import { useEdgify } from '@/app/providers/EdgifyProvider';
import { EdgeData, Position } from '@/shared/types/edgify.types';

const calculateControlPoints = (start: Position, end: Position, type: EdgeData['type'] = 'bezier'): string => {
  if (type === 'straight') {
    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }

  if (type === 'step') {
    const midX = (start.x + end.x) / 2;
    return `M ${start.x} ${start.y} 
            L ${midX} ${start.y} 
            L ${midX} ${end.y} 
            L ${end.x} ${end.y}`;
  }

  // Bezier curve by default
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const controlX1 = start.x + dx * 0.5;
  const controlX2 = end.x - dx * 0.5;

  return `M ${start.x} ${start.y} 
          C ${controlX1} ${start.y} 
            ${controlX2} ${end.y} 
            ${end.x} ${end.y}`;
};

export const Edge: React.FC<
  EdgeData & {
    sourcePosition: Position;
    targetPosition: Position;
  }
> = ({ id, type, selected, sourcePosition, targetPosition }) => {
  const { actions } = useEdgify();
  const pathString = calculateControlPoints(sourcePosition, targetPosition, type);

  return (
    <>
      {/* Invisible wider path for easier selection */}
      <path
        d={pathString}
        stroke='transparent'
        strokeWidth={20}
        fill='none'
        className='cursor-pointer'
        onClick={() => actions.updateEdge(id, { selected: true })}
      />

      {/* Visible path */}
      <path
        d={pathString}
        className={`
          transition-all duration-200
          ${selected ? 'stroke-blue-500' : 'stroke-gray-300 dark:stroke-gray-600'}
        `}
        strokeWidth={selected ? 2 : 1}
        fill='none'
        markerEnd={`url(#${selected ? 'arrow-selected' : 'arrow'})`}
      />
    </>
  );
};
