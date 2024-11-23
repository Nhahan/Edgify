import React from 'react';
import { EdgeData } from '@/shared/types/core';
import { useEdgify } from '@/features/context/EdgifyContext';

interface EdgeProps {
  data: EdgeData;
}

export const Edge: React.FC<EdgeProps> = ({ data }) => {
  const { dispatch, state } = useEdgify();
  const isSelected = state.selectedEdges.includes(data.id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: 'SELECT_EDGE',
      payload: data.id,
    });
  };

  // find source and target nodes
  const sourceNode = state.nodes.find((node) => node.id === data.source);
  const targetNode = state.nodes.find((node) => node.id === data.target);
  const sourceHandle = sourceNode?.outputs.find((output) => output.id === data.sourceHandle);
  const targetHandle = targetNode?.inputs.find((input) => input.id === data.targetHandle);

  if (!sourceNode || !targetNode || !sourceHandle || !targetHandle) return null;

  // calculate the actual connection point coord
  const startX = sourceNode.position.x + sourceNode.dimensions.width + sourceHandle.position.x;
  const startY = sourceNode.position.y + sourceHandle.position.y;
  const endX = targetNode.position.x + targetHandle.position.x;
  const endY = targetNode.position.y + targetHandle.position.y;

  // calculate control points for bezier curve
  const controlPoint1X = startX + 50;
  const controlPoint2X = endX - 50;

  // generate bezier curve path
  const pathD = `M ${startX},${startY} 
                 C ${controlPoint1X},${startY} 
                   ${controlPoint2X},${endY} 
                   ${endX},${endY}`;

  return (
    <path
      d={pathD}
      stroke={isSelected ? '#3b82f6' : '#b1b1b7'}
      strokeWidth={isSelected ? 3 : 2}
      fill='none'
      className='transition-all duration-200 hover:stroke-blue-400'
      onClick={handleClick}
    />
  );
};
