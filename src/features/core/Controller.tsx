import React from 'react';
import { PlusCircle, Save, Settings, ZoomIn, ZoomOut } from 'lucide-react';
import { useEdgify } from '@/features/context/EdgifyContext';
import { useZoom } from '@/shared/hooks/useZoom';

interface ControlButton {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export const Controller: React.FC = () => {
  const { addNode, state } = useEdgify();
  const { handleZoom } = useZoom();

  const handleAddNode = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const zoom = state.viewport.zoom;

    const centerX = (scrollX + viewportWidth / 2) / zoom;
    const centerY = (scrollY + viewportHeight / 2) / zoom;

    addNode({
      type: 'default',
      position: { x: centerX, y: centerY },
      inputs: [],
      dimensions: { width: 200, height: 100 },
      outputs: [],
      data: { label: 'New Node' },
    });
  };

  const buttons: ControlButton[] = [
    {
      icon: <PlusCircle className='w-5 h-5' />,
      label: 'Add Node',
      onClick: handleAddNode,
    },
    {
      icon: <ZoomIn className='w-5 h-5' />,
      label: 'Zoom In',
      onClick: () => handleZoom(1),
    },
    {
      icon: <ZoomOut className='w-5 h-5' />,
      label: 'Zoom Out',
      onClick: () => handleZoom(-1),
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
    <div id='Controller' className='fixed top-4 left-4 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2 z-30'>
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
