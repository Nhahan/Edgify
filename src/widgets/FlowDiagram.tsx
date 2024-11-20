import React, { useEffect, useRef } from 'react';
import { Edge } from '@/entities/edge/ui/Edge';
import { Node } from '@/entities/node/ui/Node';
import { MiniMap } from '@/shared/ui/MiniMap';
import { useEdgify } from '@/app/providers/EdgifyProvider';
import { useZoom } from '@/features/zoom/hooks/useZoom';

export const FlowDiagram: React.FC = () => {
  const { state } = useEdgify();
  const { nodes, edges, scale, position } = state;
  const containerRef = useRef<HTMLDivElement>(null);
  const { handleZoom, handlePan } = useZoom();

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    element.addEventListener('wheel', handleZoom);

    let isPanning = false;
    let lastPosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 1 || (e.button === 0 && e.altKey)) {
        isPanning = true;
        lastPosition = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isPanning) return;
      const dx = e.clientX - lastPosition.x;
      const dy = e.clientY - lastPosition.y;
      handlePan(dx, dy);
      lastPosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isPanning = false;
    };

    element.addEventListener('mousedown', onMouseDown);
    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseup', onMouseUp);
    element.addEventListener('mouseleave', onMouseUp);

    return () => {
      element.removeEventListener('wheel', handleZoom);
      element.removeEventListener('mousedown', onMouseDown);
      element.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('mouseup', onMouseUp);
      element.removeEventListener('mouseleave', onMouseUp);
    };
  }, []);

  return (
    <div ref={containerRef} className='relative w-full h-full overflow-hidden bg-gray-50 dark:bg-gray-900'>
      <div
        style={{
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          transformOrigin: '0 0',
        }}
        className='relative'
      >
        <svg className='absolute w-full h-full'>
          <defs>
            <marker id='arrow' markerWidth='12' markerHeight='12' refX='9' refY='6' orient='auto'>
              <path d='M0,0 L0,12 L9,6 z' className='fill-gray-300 dark:fill-gray-600' />
            </marker>
            <marker id='arrow-selected' markerWidth='12' markerHeight='12' refX='9' refY='6' orient='auto'>
              <path d='M0,0 L0,12 L9,6 z' className='fill-blue-500' />
            </marker>
          </defs>

          {edges.map((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            const targetNode = nodes.find((n) => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            return (
              <Edge key={edge.id} {...edge} sourcePosition={sourceNode.position} targetPosition={targetNode.position} />
            );
          })}
        </svg>

        {nodes.map((node) => (
          <Node key={node.id} {...node} />
        ))}
      </div>

      <MiniMap />
    </div>
  );
};
