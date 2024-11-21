import React, { useRef } from 'react';
import { PlusCircle, Save, Settings } from 'lucide-react';
import { useEdgify } from '@/features/context/EdgifyContext';
import { useZoom } from '@/shared/hooks/useZoom';

interface ControlButton {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export const Controller: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { addNode } = useEdgify();
  const { zoom } = useZoom();

  const handleAddNode = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = (containerRef.current.scrollLeft + rect.width / 2) / zoom;
      const centerY = (containerRef.current.scrollTop + rect.height / 2) / zoom;

      // id는 addNode 내부에서 생성되므로 제외
      addNode({
        type: 'default',
        position: { x: centerX, y: centerY },
        dimensions: { width: 200, height: 100 },
        inputs: [],
        outputs: [],
        data: { label: 'New Node' },
      });
    }
  };

  const buttons: ControlButton[] = [
    {
      icon: <PlusCircle className='w-5 h-5' />,
      label: 'Add Node',
      onClick: handleAddNode,
    },
    // Buttons for future expansion
    {
      icon: <Settings className='w-5 h-5' />,
      label: 'Settings',
      onClick: () => console.log('Settings clicked'),
    },
    {
      icon: <Save className='w-5 h-5' />,
      label: 'Save',
      onClick: () => console.log('Save clicked'),
    },
  ];

  return (
    <div id='Controller' className='absolute top-4 left-4 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2 z-30'>
      {buttons.map((button, index) => (
        <button
          key={index}
          className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center gap-2'
          onClick={button.onClick}
          title={button.label}
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
};
