import React, { useState, useRef, useEffect } from 'react';
import { Handle } from '@/shared/ui/Handle';
import { useEdgify } from '@/app/providers/EdgifyProvider';
import { NodeData, Position } from '@/shared/types/edgify.types';

export const Node: React.FC<NodeData> = ({ id, position, size, data, selected }) => {
  const { actions } = useEdgify();
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartSize, setResizeStartSize] = useState(size);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    if (e.target instanceof Element && e.target.closest('[data-handle-id]')) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    actions.updateNode(id, { selected: true });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      actions.updateNode(id, {
        position: {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        },
      });
    } else if (isResizing && nodeRef.current) {
      const newWidth = resizeStartSize.width + (e.clientX - dragStart.x);
      const newHeight = resizeStartSize.height + (e.clientY - dragStart.y);
      actions.updateNode(id, {
        size: {
          width: Math.max(100, newWidth),
          height: Math.max(50, newHeight),
        },
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart]);

  return (
    <div
      ref={nodeRef}
      className={`
        absolute flex flex-col p-4 rounded-lg shadow-lg cursor-move
        bg-white dark:bg-gray-800 
        ${selected ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200 dark:ring-gray-700'}
        transition-shadow duration-200
      `}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: size.width,
        height: size.height,
        zIndex: selected ? 1 : 0,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className='text-sm font-medium dark:text-white'>{data.label}</div>
      <div className='text-xs text-gray-500 dark:text-gray-400'>{data.description}</div>

      <Handle id={`${id}-top`} type='target' position='top' nodeId={id} />
      <Handle id={`${id}-right`} type='source' position='right' nodeId={id} />
      <Handle id={`${id}-bottom`} type='source' position='bottom' nodeId={id} />
      <Handle id={`${id}-left`} type='target' position='left' nodeId={id} />

      {/* Resize handle */}
      <div
        className='absolute bottom-0 right-0 w-4 h-4 cursor-se-resize'
        onMouseDown={(e) => {
          e.stopPropagation();
          setIsResizing(true);
          setDragStart({
            x: e.clientX,
            y: e.clientY,
          });
          setResizeStartSize(size);
        }}
      />
    </div>
  );
};
