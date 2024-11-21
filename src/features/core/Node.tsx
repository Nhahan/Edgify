import React, { useState } from 'react';
import { HandleData, NodeData } from '@/shared/types/core';
import { Handle } from './Handle';
import { useEdgify } from '@/features/context/EdgifyContext';

interface NodeProps {
  data: NodeData;
  onSelect?: (nodeId: string) => void;
}

export const Node: React.FC<NodeProps> = ({ data, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { updateNodePosition, dispatch } = useEdgify();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('nodeId', data.id);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.clientX && e.clientY) {
      updateNodePosition(data.id, {
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleAddOutput = () => {
    const newOutput: HandleData = {
      id: `output-${Date.now()}`,
      nodeId: data.id,
      type: 'output',
      position: {
        x: data.dimensions.width,
        y: (data.outputs.length + 1) * 30, // 30px spacing
      },
    };

    dispatch({
      type: 'UPDATE_NODE',
      payload: {
        ...data,
        outputs: [...data.outputs, newOutput],
      },
    });
  };

  return (
    <div
      className='absolute p-4 bg-white rounded-lg shadow-lg cursor-move'
      style={{
        left: data.position.x,
        top: data.position.y,
        width: data.dimensions.width,
        height: data.dimensions.height,
      }}
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(data.id)}
    >
      <>
        {data.inputs.map((input) => (
          <Handle key={input.id} data={input} type='input' />
        ))}
        {data.outputs.map((output) => (
          <Handle key={output.id} data={output} type='output' />
        ))}
        {isHovered && (
          <button
            className='absolute top-2 right-2 p-1 bg-blue-500 text-white rounded-full'
            onClick={(e) => {
              e.stopPropagation();
              handleAddOutput();
            }}
          >
            +
          </button>
        )}
        {data.data?.label && <div className='text-center font-medium'>{String(data.data.label)}</div>}
      </>
    </div>
  );
};
