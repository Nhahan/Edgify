import React, { useState } from 'react';
import { HandleData, NodeData } from '@/shared/types/core';
import { Handle } from './Handle';
import { useEdgify } from '@/features/context/EdgifyContext';

interface NodeProps {
  data: NodeData;
  zoom: number;
}

export const Node: React.FC<NodeProps> = ({ data, zoom }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { dispatch, state } = useEdgify();
  const isSelected = state.selectedNodes.includes(data.id);
  const [previewInput, setPreviewInput] = useState<HandleData | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    // add preview input
    if (!previewInput) {
      setPreviewInput({
        id: `preview-input-${Date.now()}`,
        nodeId: data.id,
        type: 'input',
        position: {
          x: 0,
          y: (data.inputs.length + 1) * 30,
        },
      });
    }
  };

  const handleDragLeave = () => {
    setPreviewInput(null);
  };

  const handleClick = () => {
    dispatch({
      type: 'SELECT_NODE',
      payload: data.id,
    });
  };

  const handleAddEdge = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newOutput: HandleData = {
      id: `output-${Date.now()}`,
      nodeId: data.id,
      type: 'output',
      position: {
        x: data.dimensions.width,
        y: (data.outputs.length + 1) * 30,
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

  const handleRemoveEdge = (e: React.MouseEvent) => {
    e.stopPropagation();
    // remove last output
    if (data.outputs.length > 0) {
      dispatch({
        type: 'UPDATE_NODE',
        payload: {
          ...data,
          outputs: data.outputs.slice(0, -1),
        },
      });
    }
  };

  return (
    <div
      className={`absolute p-4 bg-white rounded-lg shadow-lg cursor-move
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${isHovered ? 'ring-1 ring-gray-300' : ''}`}
      style={{
        left: data.position.x,
        top: data.position.y,
        width: data.dimensions.width * zoom,
        height: data.dimensions.height * zoom,
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <>
        {/* existing inputs */}
        {data.inputs.map((input) => (
          <Handle key={input.id} data={input} type='input' />
        ))}
        {/* preview inputs */}
        {previewInput && <Handle data={previewInput} type='input' isPreview={true} />}
        {/* existing outputs */}
        {data.outputs.map((output) => (
          <Handle key={output.id} data={output} type='output' />
        ))}
        {(isHovered || isSelected) && (
          <>
            <button
              className='absolute -right-3 -top-3 w-6 h-6 bg-blue-500 text-white rounded-full'
              onClick={handleAddEdge}
            >
              +
            </button>
            <button
              className='absolute -right-3 -bottom-3 w-6 h-6 bg-red-500 text-white rounded-full'
              onClick={handleRemoveEdge}
            >
              -
            </button>
          </>
        )}
      </>
    </div>
  );
};
