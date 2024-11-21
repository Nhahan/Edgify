import React from 'react';

export const Background: React.FC<{
  gridSize?: number;
  gridColor?: string;
  scale: number;
}> = ({
  gridSize = 20,
  gridColor = 'rgb(229, 231, 235)', // Tailwind gray-200
  scale,
}) => {
  // Adjust grid size based on zoom level
  const adjustedGridSize = gridSize * scale;

  return (
    <svg className='absolute inset-0 w-full h-full -z-10'>
      <defs>
        <pattern id='grid' width={adjustedGridSize} height={adjustedGridSize} patternUnits='userSpaceOnUse'>
          <path
            d={`M ${adjustedGridSize} 0 L 0 0 0 ${adjustedGridSize}`}
            fill='none'
            stroke={gridColor}
            strokeWidth='0.5'
          />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='url(#grid)' />
    </svg>
  );
};
