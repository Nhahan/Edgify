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
import { Controller } from '@/features/core/Controller';
import { EdgePreview } from '@/features/core/EdgePreview';

interface EdgifyProps {
  initializeNode?: boolean;
  onNodesChange?: (nodes: NodeData[]) => void;
  onEdgesChange?: (edges: EdgeData[]) => void;
  width?: number;
  height?: number;
}

export const EdgifyCanvas: React.FC<EdgifyProps> = ({
  initializeNode = true,
  onNodesChange,
  onEdgesChange,
  width = 4000,
  height = 3000,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const { zoom, handleZoom } = useZoom();
  const { handleDrag } = useDragAndDrop();
  const { state, addNode } = useEdgify();
  const edgifyState = state.history.present;
  const { debouncedNodesUpdate, debouncedEdgesUpdate } = useStateUpdate(onNodesChange, onEdgesChange);
  useKeyboardShortcuts();

  // Initialize first node if initializeNode is true
  useEffect(() => {
    if (initializeNode && !hasInitialized.current) {
      const defaultDimensions = {
        width: 200,
        height: 100,
      };

      // Calculate center position
      const centerX = width / 2 - defaultDimensions.width / 2;
      const centerY = height / 2 - defaultDimensions.height / 2;

      // Add initial node
      addNode({
        type: 'default',
        position: { x: centerX, y: centerY },
        dimensions: defaultDimensions,
        inputs: [],
        outputs: [],
        data: { label: 'New Node' },
      });

      hasInitialized.current = true;
    }
  }, [initializeNode, addNode, width, height, edgifyState.nodes.length]);

  useEffect(() => {
    if (containerRef.current) {
      const centerX = width / 2 - window.innerWidth / 2;
      const centerY = height / 2 - window.innerHeight / 2;
      containerRef.current.scrollLeft = centerX;
      containerRef.current.scrollTop = centerY;
    }
  }, [width, height]);

  useEffect(() => {
    debouncedNodesUpdate(edgifyState.nodes);
  }, [edgifyState.nodes, debouncedNodesUpdate]);

  useEffect(() => {
    debouncedEdgesUpdate(edgifyState.edges);
  }, [edgifyState.edges, debouncedEdgesUpdate]);

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
      className='relative overflow-auto w-full h-screen'
      onWheel={handleWheel}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Background width={width} height={height} />

      {/* Render edges and edge preview */}
      <svg
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: width,
          height: height,
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
        {edgifyState.edges.map((edge) => (
          <Edge key={edge.id} data={edge} />
        ))}
        {edgifyState.edgePreview && <EdgePreview preview={edgifyState.edgePreview} />}
      </svg>

      {/* Render nodes */}
      {edgifyState.nodes.map((node) => (
        <Node key={node.id} data={node} zoom={zoom} />
      ))}

      <Controller />
      <MiniMap width={width} height={height} />
    </div>
  );
};
