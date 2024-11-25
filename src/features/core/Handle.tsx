import React, { useRef } from 'react';
import { HandleData, Position } from '@/shared/types/core';
import { useEdgify } from '@/features/context/EdgifyContext';

interface HandleProps {
  data: HandleData;
  type: 'input' | 'output';
  isPreview?: boolean;
}

export const Handle: React.FC<HandleProps> = ({ data, type, isPreview = false }) => {
  const { dispatch } = useEdgify();
  const handleRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (type !== 'output') return;

    e.stopPropagation();

    const sourceHandleData = {
      nodeId: data.nodeId,
      handleId: data.id,
      type: 'output',
    };

    e.dataTransfer.setData('application/edgify-handle', JSON.stringify(sourceHandleData));
    e.dataTransfer.effectAllowed = 'move';

    // Get the handle's position in the viewport
    const rect = e.currentTarget.getBoundingClientRect();
    const fromPosition: Position = {
      x: rect.left + rect.width / 2 + window.scrollX,
      y: rect.top + rect.height / 2 + window.scrollY,
    };

    dispatch({
      type: 'START_EDGE_PREVIEW',
      payload: {
        sourceNodeId: data.nodeId,
        sourceHandleId: data.id,
        fromPosition,
        toPosition: fromPosition,
      },
    });
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (type !== 'output') return;

    e.preventDefault();

    const toPosition: Position = {
      x: e.clientX + window.scrollX,
      y: e.clientY + window.scrollY,
    };

    dispatch({
      type: 'UPDATE_EDGE_PREVIEW',
      payload: toPosition,
    });
  };

  const handleDragEnd = () => {
    if (type !== 'output') return;

    dispatch({ type: 'END_EDGE_PREVIEW' });
  };

  return (
    <div
      id={`handle-${data.id}`}
      ref={handleRef}
      className={`absolute ${type === 'input' ? '-left-4' : '-right-4'} w-3 h-3 
        ${isPreview ? 'opacity-50' : ''} 
        bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600`}
      style={{
        top: data.position.y - 6,
      }}
      draggable={type === 'output'}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onMouseDown={(e) => e.stopPropagation()}
    />
  );
};
