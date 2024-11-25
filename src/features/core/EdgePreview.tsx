import React from 'react';
import { Position } from '@/shared/types/core';

interface EdgePreviewProps {
  preview: {
    fromPosition: Position;
    toPosition: Position;
  };
}

export const EdgePreview: React.FC<EdgePreviewProps> = ({ preview }) => {
  const { fromPosition, toPosition } = preview;

  // Bezier curve control points
  const controlPointOffset = 50;
  const controlPoint1 = {
    x: fromPosition.x + controlPointOffset,
    y: fromPosition.y,
  };
  const controlPoint2 = {
    x: toPosition.x - controlPointOffset,
    y: toPosition.y,
  };

  const pathD = `M ${fromPosition.x},${fromPosition.y}
                 C ${controlPoint1.x},${controlPoint1.y}
                   ${controlPoint2.x},${controlPoint2.y}
                   ${toPosition.x},${toPosition.y}`;

  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      <path d={pathD} stroke='#FFFFFF' strokeWidth={2} fill='none' />
    </svg>
  );
};
