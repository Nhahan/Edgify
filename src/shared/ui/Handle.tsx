import React from 'react';
import { useEdgify } from '@/app/providers/EdgifyProvider';

interface HandleProps {
  id: string;
  type: 'source' | 'target';
  position: 'top' | 'right' | 'bottom' | 'left';
  nodeId: string;
  onConnect?: (params: { source: string; target: string }) => void;
}

export const Handle: React.FC<HandleProps> = ({ id, type, position, nodeId, onConnect }) => {
  const { state } = useEdgify();
  const { selectedNodeIds } = state;
  const isSelected = selectedNodeIds.includes(nodeId);

  const handlePositionClass = {
    top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
    right: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2',
    bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
    left: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2',
  }[position];

  return (
    <div
      className={`
        absolute w-3 h-3 rounded-full cursor-crosshair 
        transition-all duration-150 ease-in-out
        ${isSelected ? 'bg-blue-500' : 'bg-gray-400'}
        ${isSelected ? 'scale-100' : 'scale-75'}
        hover:scale-100 hover:bg-blue-500
        ${handlePositionClass}
      `}
      data-handle-id={id}
      data-handle-type={type}
      data-node-id={nodeId}
    />
  );
};
