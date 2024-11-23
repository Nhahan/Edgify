import React, { useRef, useState } from 'react';
import { HandleData } from '@/shared/types/core';
import { useEdgify } from '@/features/context/EdgifyContext';

interface HandleProps {
  data: HandleData;
  type: 'input' | 'output';
  isPreview?: boolean;
}

export const Handle: React.FC<HandleProps> = ({ data, type, isPreview = false }) => {
  const { dispatch } = useEdgify();
  const [isDragging, setIsDragging] = useState(false);
  const handleRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (type === 'input') return; // input handles cannot be dragged

    setIsDragging(true);
    e.dataTransfer.setData(
      'sourceHandle',
      JSON.stringify({
        nodeId: data.nodeId,
        handleId: data.id,
        position: data.position,
      }),
    );
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (type === 'output') return; // output handles are not drop targets

    e.preventDefault();
    e.dataTransfer.dropEffect = 'link';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (type === 'output') return;

    const sourceData = JSON.parse(e.dataTransfer.getData('sourceHandle'));
    if (sourceData.nodeId === data.nodeId) return; // prevent self-connections

    dispatch({
      type: 'ADD_EDGE',
      payload: {
        id: `edge-${Date.now()}`,
        source: sourceData.nodeId,
        sourceHandle: sourceData.handleId,
        target: data.nodeId,
        targetHandle: data.id,
      },
    });
  };

  return (
    <div
      ref={handleRef}
      className={`absolute ${type === 'input' ? 'left-0' : 'right-0'} w-3 h-3 
        ${isPreview ? 'opacity-50' : ''} 
        ${isDragging ? 'bg-blue-300' : 'bg-blue-500'} 
        rounded-full -translate-x-1/2 cursor-pointer hover:bg-blue-600`}
      style={{
        top: data.position.y,
      }}
      draggable={type === 'output'}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    />
  );
};
