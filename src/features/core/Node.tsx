import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HandleData, NodeData, NodeResizeCursorType } from '@/shared/types/core';
import { Handle } from './Handle';
import { useEdgify } from '@/features/context/EdgifyContext';

interface NodeProps {
  data: NodeData;
  zoom: number;
}

export const Node: React.FC<NodeProps> = ({ data, zoom }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [cursor, setCursor] = useState<NodeResizeCursorType>('move');
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [previewInput, setPreviewInput] = useState<HandleData | null>(null);
  const { dispatch, state } = useEdgify();
  const isSelected = state.selectedNodes.includes(data.id);

  const [dragStart, setDragStart] = useState<{
    mouseX: number;
    mouseY: number;
    nodeX: number;
    nodeY: number;
  } | null>(null);

  // calculate vertical center position for handles
  const calculateHandlePosition = () => {
    return data.dimensions.height / 2;
  };

  // calculate minimum height based on number of handles
  const calculateMinHeight = () => {
    const handleCount = Math.max(data.inputs.length, data.outputs.length);
    const handleSpacing = 30; // spacing between handles
    const padding = 40; // top and bottom padding
    return Math.max(handleCount * handleSpacing + padding, 100); // minimum 100px
  };

  // adjust node height when handles are added/removed
  useEffect(() => {
    const minHeight = calculateMinHeight();
    if (data.dimensions.height < minHeight) {
      dispatch({
        type: 'UPDATE_NODE',
        payload: {
          ...data,
          dimensions: {
            ...data.dimensions,
            height: minHeight,
          },
        },
      });
    }
  }, [data.inputs.length, data.outputs.length]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const newCursor = getBorderCursor(e);
    if (newCursor !== 'move') {
      e.preventDefault(); // prevent text selection
      e.stopPropagation();
      setIsResizing(true);
      setResizeDirection(newCursor.split('-')[0]);
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    const background = document.getElementById('Background');
    if (!background || !background.parentElement) return;

    const containerRect = background.parentElement.getBoundingClientRect();

    const mouseX = e.clientX - containerRect.left + background.parentElement.scrollLeft;
    const mouseY = e.clientY - containerRect.top + background.parentElement.scrollTop;

    const nodeX = data.position.x;
    const nodeY = data.position.y;

    setDragStart({ mouseX, mouseY, nodeX, nodeY });
  };

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        if (nodeRef.current && dragStart) {
          const background = document.getElementById('Background');
          if (!background || !background.parentElement) return;

          const containerRect = background.parentElement.getBoundingClientRect();

          const mouseX = e.clientX - containerRect.left + background.parentElement.scrollLeft;
          const mouseY = e.clientY - containerRect.top + background.parentElement.scrollTop;

          const deltaX = (mouseX - dragStart.mouseX) / zoom;
          const deltaY = (mouseY - dragStart.mouseY) / zoom;

          const newX = dragStart.nodeX + deltaX;
          const newY = dragStart.nodeY + deltaY;

          dispatch({
            type: 'UPDATE_NODE_POSITION',
            payload: {
              nodeId: data.id,
              position: {
                x: newX,
                y: newY,
              },
            },
          });
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        setDragStart(null);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, zoom, dispatch, data.id]);

  const handleResize = useCallback(
    (e: MouseEvent) => {
      if (isResizing && nodeRef.current) {
        const rect = nodeRef.current.getBoundingClientRect();
        let newWidth = data.dimensions.width;
        let newHeight = data.dimensions.height;
        const minHeight = calculateMinHeight();

        if (resizeDirection?.includes('e')) {
          newWidth = Math.max(1000, (e.clientX - rect.left) / zoom);
        }
        if (resizeDirection?.includes('s')) {
          newHeight = Math.max(minHeight, (e.clientY - rect.top) / zoom);
        }

        dispatch({
          type: 'UPDATE_NODE',
          payload: {
            ...data,
            dimensions: { width: newWidth, height: newHeight },
          },
        });
      }
    },
    [isResizing, resizeDirection, zoom, data, dispatch],
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeDirection(null);
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', handleResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleResize);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResize, handleResizeEnd]);

  // handle connection preview
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const sourceNodeId = e.dataTransfer.getData('sourceNodeId');

    // prevent self-connection
    if (sourceNodeId === data.id) return;

    if (!previewInput && sourceNodeId !== data.id) {
      setPreviewInput({
        id: `preview-input-${Date.now()}`,
        nodeId: data.id,
        type: 'input',
        position: {
          x: 0,
          y: calculateHandlePosition(),
        },
      });
    }
  };

  const handleDragLeave = () => {
    setPreviewInput(null);
  };

  // node selection
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: 'SELECT_NODE',
      payload: data.id,
    });
  };

  // handle management
  const handleAddEdge = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newOutput: HandleData = {
      id: `output-${Date.now()}`,
      nodeId: data.id,
      type: 'output',
      position: {
        x: data.dimensions.width,
        y: calculateHandlePosition(),
      },
    };

    const newOutputs = [...data.outputs, newOutput];
    const minHeight = calculateMinHeight();

    dispatch({
      type: 'UPDATE_NODE',
      payload: {
        ...data,
        outputs: newOutputs,
        dimensions: {
          ...data.dimensions,
          height: Math.max(data.dimensions.height, minHeight),
        },
      },
    });
  };

  const handleRemoveEdge = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  // resize cursor styles based on border position
  const getBorderCursor = (e: React.MouseEvent<HTMLDivElement>): NodeResizeCursorType => {
    if (!nodeRef.current) return 'move';

    const rect = nodeRef.current.getBoundingClientRect();
    const border = 8;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const onRightBorder = x > rect.width - border;
    const onBottomBorder = y > rect.height - border;

    if (onRightBorder && onBottomBorder) return 'se-resize';
    if (onRightBorder) return 'e-resize';
    if (onBottomBorder) return 's-resize';
    return 'move';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isResizing && !isDragging) {
      const newCursor = getBorderCursor(e);
      setCursor(newCursor);
    }
  };

  return (
    <div
      ref={nodeRef}
      className={`absolute bg-white rounded-lg shadow-lg
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${isHovered ? 'ring-1 ring-gray-300' : ''}`}
      style={{
        left: data.position.x,
        top: data.position.y,
        width: data.dimensions.width,
        height: data.dimensions.height,
        transform: `scale(${zoom})`,
        transformOrigin: '0 0',
        padding: '20px',
        cursor: cursor,
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <>
        {/* input handles */}
        {data.inputs.map((input) => (
          <Handle
            key={input.id}
            data={{
              ...input,
              position: {
                x: -8,
                y: data.dimensions.height / 2,
              },
            }}
            type='input'
          />
        ))}

        {previewInput && <Handle data={previewInput} type='input' isPreview={true} />}

        {/* output handles */}
        {data.outputs.map((output) => (
          <Handle
            key={output.id}
            data={{
              ...output,
              position: {
                x: data.dimensions.width + 8,
                y: data.dimensions.height / 2,
              },
            }}
            type='output'
          />
        ))}

        {/* control buttons - shown when hovered or selected */}
        {(isHovered || isSelected) && (
          <>
            <div
              className='absolute right-0 -top-8 flex flex-col items-center h-12'
              style={{ transform: `scale(${1 / zoom})` }}
            >
              {/* counter zoom effect */}
              <button className='w-6 h-6 bg-blue-500 text-white rounded-full hover:bg-blue-600' onClick={handleAddEdge}>
                +
              </button>
            </div>
            <div
              className='absolute right-0 -bottom-8 flex flex-col-reverse items-center h-12'
              style={{ transform: `scale(${1 / zoom})` }}
            >
              <button
                className='w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600'
                onClick={handleRemoveEdge}
              >
                -
              </button>
            </div>
          </>
        )}

        {/* node label */}
        {data.data?.label && <div className='text-center font-medium'>{String(data.data.label)}</div>}
      </>
    </div>
  );
};
