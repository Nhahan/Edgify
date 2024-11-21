import React from 'react';
import { HandleData } from '@/shared/types/core';

interface HandleProps {
  data: HandleData;
  type: 'input' | 'output';
}

export const Handle: React.FC<HandleProps> = ({ data, type }) => {
  const position = type === 'input' ? 'left-0' : 'right-0';

  return (
    <div
      className={`absolute ${position} w-3 h-3 bg-blue-500 rounded-full -translate-x-1/2 cursor-pointer hover:bg-blue-600`}
      style={{
        top: data.position.y,
      }}
    />
  );
};
