// @/entities/node/ui/Node
import React, { useState } from 'react';
import { Handle } from '@/shared/ui/Handle';
import { useEdgify } from '@/app/providers/EdgifyProvider';
import { NodeData } from '@/shared/types/edgify.types';
import { PlusCircle } from 'lucide-react';

export const Node: React.FC<NodeData> = ({ id, position, size, data, selected }) => {
  const { actions } = useEdgify();
  const [isHovered, setIsHovered] = useState(false);
  const handleHeight = 12;
  const handleSpacing = 24;

  // 각 output handle의 위치 계산
  const getOutputPosition = (index: number): number => {
    const totalHeight = data.outputs.length * handleSpacing;
    const startY = (size.height - totalHeight) / 2;
    return startY + index * handleSpacing + handleHeight;
  };

  const handleAddOutput = () => {
    const newOutput = {
      id: `${id}-output-${data.outputs.length + 1}`,
      label: `Output ${data.outputs.length + 1}`,
    };

    actions.updateNode(id, {
      data: {
        ...data,
        outputs: [...data.outputs, newOutput],
      },
    });
  };

  return (
    <div
      className={`
        absolute flex flex-col p-4 rounded-lg shadow-lg
        bg-white dark:bg-gray-800 
        ${selected ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200 dark:ring-gray-700'}
        transition-shadow duration-200
      `}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: size.width,
        height: size.height,
        zIndex: selected ? 1 : 0,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Input Handle (왼쪽) */}
      {data.inputs?.map((input, index) => (
        <Handle
          key={input.id}
          id={input.id}
          type='target'
          position='left'
          nodeId={id}
          style={{
            top: getOutputPosition(index),
          }}
          isInput
          label={input.label}
        />
      ))}

      {/* Node Content */}
      <div className='flex flex-col h-full'>
        <div className='text-sm font-medium dark:text-white'>{data.label}</div>
        {data.description && <div className='text-xs text-gray-500 dark:text-gray-400'>{data.description}</div>}
      </div>

      {/* Output Handles (오른쪽) */}
      {data.outputs.map((output, index) => (
        <Handle
          key={output.id}
          id={output.id}
          type='source'
          position='right'
          nodeId={id}
          style={{
            top: getOutputPosition(index),
          }}
          label={output.label}
        />
      ))}

      {/* Add Output Button */}
      {(selected || isHovered) && (
        <button
          className='absolute -right-6 top-0 p-1 text-blue-500 hover:text-blue-600
                     transition-colors duration-150 bg-white rounded-full shadow-sm'
          onClick={handleAddOutput}
          title='Add output'
        >
          <PlusCircle size={16} />
        </button>
      )}
    </div>
  );
};
