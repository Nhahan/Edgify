import { useCallback, useRef } from 'react';
import { NodeData, EdgeData } from '@/shared/types/core';

export const useStateUpdate = (
  onNodesChange?: (nodes: NodeData[]) => void,
  onEdgesChange?: (edges: EdgeData[]) => void,
) => {
  const nodesTimeoutRef = useRef<NodeJS.Timeout>();
  const edgesTimeoutRef = useRef<NodeJS.Timeout>();

  const debouncedNodesUpdate = useCallback(
    (nodes: NodeData[]) => {
      if (nodesTimeoutRef.current) {
        clearTimeout(nodesTimeoutRef.current);
      }
      nodesTimeoutRef.current = setTimeout(() => {
        onNodesChange?.(nodes);
      }, 200); // 200ms 디바운스
    },
    [onNodesChange],
  );

  const debouncedEdgesUpdate = useCallback(
    (edges: EdgeData[]) => {
      if (edgesTimeoutRef.current) {
        clearTimeout(edgesTimeoutRef.current);
      }
      edgesTimeoutRef.current = setTimeout(() => {
        onEdgesChange?.(edges);
      }, 200); // 200ms 디바운스
    },
    [onEdgesChange],
  );

  return {
    debouncedNodesUpdate,
    debouncedEdgesUpdate,
  };
};
