import React, { useCallback, useRef } from 'react';
import { useEdgify } from '@/app/providers/EdgifyProvider';

interface HandleProps {
  id: string;
  type: 'source' | 'target';
  position: 'left' | 'right';
  nodeId: string;
  style?: React.CSSProperties;
  isInput?: boolean;
  label?: string;
}

export const Handle: React.FC<HandleProps> = ({ id, type, position, nodeId, style, isInput, label }) => {
  const { state, actions } = useEdgify();
  const handleRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isInput || !handleRef.current) return; // Input handles can't initiate connections

      const startX = handleRef.current.getBoundingClientRect().x;
      const startY = handleRef.current.getBoundingClientRect().y;

      // Create temporary edge
      const tempEdgeId = `temp-${nodeId}-${id}`;
      actions.addEdge({
        id: tempEdgeId,
        source: nodeId,
        sourceHandle: id,
        target: nodeId, // temporary self-connection
        targetHandle: id, // temporary self-connection
        type: 'bezier',
      });

      const handleMouseMove = (e: MouseEvent) => {
        // Update temporary edge's target position through node update
        // This will be handled by the Edge component's position calculation
      };

      const handleMouseUp = (e: MouseEvent) => {
        const targetElement = document.elementFromPoint(e.clientX, e.clientY);
        const targetHandle = targetElement?.closest('[data-handle-id]') as HTMLElement;

        if (targetHandle && targetHandle.getAttribute('data-handle-type') === 'target') {
          const targetNodeId = targetHandle.getAttribute('data-node-id');
          const targetHandleId = targetHandle.getAttribute('data-handle-id');

          if (targetNodeId && targetHandleId) {
            // Create actual edge
            actions.addEdge({
              id: `${nodeId}-${targetNodeId}`,
              source: nodeId,
              sourceHandle: id,
              target: targetNodeId,
              targetHandle: targetHandleId,
              type: 'bezier',
            });
          }
        }

        // Remove temporary edge
        actions.deleteEdge(tempEdgeId);

        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [nodeId, id, isInput, actions],
  );

  return (
    <div
      ref={handleRef}
      className={`
        absolute w-3 h-3 rounded-full cursor-crosshair 
        transition-all duration-150 ease-in-out
        ${isInput ? 'bg-green-500' : 'bg-blue-500'}
        hover:scale-110
      `}
      style={{
        ...style,
        [position]: '-6px',
        transform: `translate${position === 'left' ? 'X(-50%)' : 'X(50%)'}`,
      }}
      data-handle-id={id}
      data-handle-type={type}
      data-node-id={nodeId}
      onMouseDown={handleMouseDown}
    >
      {label && (
        <span
          className={`
          absolute whitespace-nowrap text-xs px-2
          ${position === 'left' ? '-left-2' : '-right-2'}
          transform ${position === 'left' ? '-translate-x-full' : 'translate-x-full'}
        `}
        >
          {label}
        </span>
      )}
    </div>
  );
};
