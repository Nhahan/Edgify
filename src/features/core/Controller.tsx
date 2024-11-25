// Controller.tsx
import React from 'react';
import { PlusCircle, Redo, Save, Settings, Undo, ZoomIn, ZoomOut } from 'lucide-react';
import { useEdgify } from '@/features/context/EdgifyContext';
import { useZoom } from '@/shared/hooks/useZoom';
import { NodeData } from '@/shared/types/core';

interface ControlButton {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export const Controller: React.FC = () => {
  const { addNode, state, undo, redo } = useEdgify();
  const edgifyState = state.history.present;
  const { handleZoom } = useZoom();

  const handleAddNode = () => {
    const container = document.querySelector('.relative.overflow-auto.w-full.h-screen') as HTMLElement;
    if (!container) return;

    const { scrollLeft, scrollTop, clientWidth, clientHeight } = container;
    const zoomLevel = edgifyState.viewport.zoom;

    // Calculate center position in the canvas coordinate system
    const centerX = (scrollLeft + clientWidth / 2) / zoomLevel;
    const centerY = (scrollTop + clientHeight / 2) / zoomLevel;

    // Generate a unique label
    const generateNodeLabel = (nodes: NodeData[]): string => {
      const baseLabel = 'New Node';
      const existingLabels = nodes.map((node) => node.data?.label as string);
      let label = baseLabel;
      let counter = 1;

      while (existingLabels.includes(label)) {
        counter += 1;
        label = `${baseLabel} ${counter}`;
      }

      return label;
    };

    addNode({
      type: 'default',
      position: { x: centerX - 100, y: centerY - 50 }, // Adjust for node dimensions
      dimensions: { width: 200, height: 100 },
      inputs: [],
      outputs: [],
      data: { label: generateNodeLabel(edgifyState.nodes) },
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
    {
      icon: <Undo className='w-5 h-5' />,
      label: 'Undo',
      onClick: undo,
    },
    {
      icon: <Redo className='w-5 h-5' />,
      label: 'Redo',
      onClick: redo,
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
