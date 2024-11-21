import React, { useEffect, useRef } from 'react';
import { Background } from './Background';
import { MiniMap } from './MiniMap';
import { EdgeData, NodeData } from '@/shared/types/core';
import { useZoom } from '@/shared/hooks/useZoom';
import { useDragAndDrop } from '@/shared/hooks/useDragAndDrop';
import { useKeyboardShortcuts } from '@/shared/hooks/useKeyboardShortcuts';
import { Edge } from '@/features/core/Edge';
import { Node } from '@/features/core/Node';
import { useEdgify } from '@/features/context/EdgifyContext';
import { useStateUpdate } from '@/shared/hooks/useStateUpdate';

interface EdgifyProps {
  initialNodes?: NodeData[];
  initialEdges?: EdgeData[];
  onNodesChange?: (nodes: NodeData[]) => void;
  onEdgesChange?: (edges: EdgeData[]) => void;
  className?: string;
  width?: number;
  height?: number;
}

export const EdgifyCanvas: React.FC<EdgifyProps> = ({
  initialNodes = [],
  initialEdges = [],
  onNodesChange,
  onEdgesChange,
  className,
  width = 1920,
  height = 1080,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { zoom, handleZoom } = useZoom();
  const { handleDrag } = useDragAndDrop();
  const { state, addNode, addEdge } = useEdgify();
  const { debouncedNodesUpdate, debouncedEdgesUpdate } = useStateUpdate(onNodesChange, onEdgesChange);
  useKeyboardShortcuts();

  useEffect(() => {
    debouncedNodesUpdate(state.nodes);
  }, [state.nodes, debouncedNodesUpdate]);

  useEffect(() => {
    debouncedEdgesUpdate(state.edges);
  }, [state.edges, debouncedEdgesUpdate]);

  useEffect(() => {
    initialNodes.forEach(addNode);
    initialEdges.forEach(addEdge);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      handleZoom(e.deltaY > 0 ? -1 : 1);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    const nodeId = e.dataTransfer.getData('nodeId');
    if (nodeId && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const position = {
        x: (e.clientX - rect.left) / zoom,
        y: (e.clientY - rect.top) / zoom,
      };
      handleDrag(nodeId, position);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
      onWheel={handleWheel}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Background />
      <svg className='absolute inset-0 w-full h-full' style={{ transform: `scale(${zoom})` }}>
        {state.edges.map((edge) => (
          <Edge key={edge.id} data={edge} />
        ))}
      </svg>
      <div style={{ transform: `scale(${zoom})` }}>
        {state.nodes.map((node) => (
          <Node key={node.id} data={node} />
        ))}
      </div>
      <MiniMap />
    </div>
  );
};
