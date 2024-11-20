import React, { useMemo } from 'react';
import { useEdgify } from '@/app/providers/EdgifyProvider';
import { NodeData, EdgeData, Position } from '@/shared/types/edgify.types';

interface MinimapProps {
  width?: number;
  height?: number;
}

export const MiniMap: React.FC<MinimapProps> = ({ width = 200, height = 150 }) => {
  const { state } = useEdgify();
  const { nodes, edges, scale, position } = state;

  // Calculate bounds and scale
  const bounds = useMemo(() => {
    if (nodes.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };

    return nodes.reduce(
      (acc, node) => ({
        minX: Math.min(acc.minX, node.position.x),
        minY: Math.min(acc.minY, node.position.y),
        maxX: Math.max(acc.maxX, node.position.x + node.size.width),
        maxY: Math.max(acc.maxY, node.position.y + node.size.height),
      }),
      {
        minX: Infinity,
        minY: Infinity,
        maxX: -Infinity,
        maxY: -Infinity,
      },
    );
  }, [nodes]);

  const viewportScale = useMemo(() => {
    const graphWidth = bounds.maxX - bounds.minX;
    const graphHeight = bounds.maxY - bounds.minY;
    return Math.min(width / graphWidth, height / graphHeight) * 0.9;
  }, [bounds, width, height]);

  const transformNode = (pos: Position) => ({
    x: (pos.x - bounds.minX) * viewportScale,
    y: (pos.y - bounds.minY) * viewportScale,
  });

  return (
    <div className='absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2'>
      <svg width={width} height={height}>
        {/* Edges */}
        {edges.map((edge) => {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          const targetNode = nodes.find((n) => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          const source = transformNode(sourceNode.position);
          const target = transformNode(targetNode.position);

          return (
            <line
              key={edge.id}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              className='stroke-gray-300 dark:stroke-gray-600'
              strokeWidth={1}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const { x, y } = transformNode(node.position);
          const nodeWidth = node.size.width * viewportScale;
          const nodeHeight = node.size.height * viewportScale;

          return (
            <rect
              key={node.id}
              x={x}
              y={y}
              width={nodeWidth}
              height={nodeHeight}
              className={`
                ${node.selected ? 'fill-blue-500' : 'fill-gray-200 dark:fill-gray-700'}
              `}
              rx={2}
            />
          );
        })}

        {/* Viewport rectangle */}
        <rect
          x={-position.x * viewportScale}
          y={-position.y * viewportScale}
          width={width / scale}
          height={height / scale}
          className='fill-none stroke-blue-500 stroke-1 opacity-50'
        />
      </svg>
    </div>
  );
};
