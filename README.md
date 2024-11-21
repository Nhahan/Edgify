# Edgify

Edgify is a lightweight, customizable React flow diagram library that enables you to create interactive node-based workflows with a natural left-to-right flow direction. Built with TypeScript and styled with Tailwind CSS, it provides an intuitive interface for creating and managing complex flow diagrams.

## Features

- 🎯 Intuitive left-to-right flow direction
- 🔄 Undo/Redo support
- 🖱️ Zoom and pan capabilities
- 🎨 Customizable node styling with Tailwind CSS
- 🧲 Magnetic node connections
- 📱 Responsive design
- 🗺️ MiniMap navigation
- ⌨️ Keyboard shortcuts
- 🎮 Controller interface for node management

## Quick Start

### 1. Basic Setup

```tsx
import { EdgifyProvider } from 'edgify';

function App() {
  return (
    <EdgifyProvider>
      <YourFlowDiagram />
    </EdgifyProvider>
  );
}
```

### 2. Create Your Flow Diagram

```tsx
import { EdgifyCanvas, NodeData, EdgeData } from 'edgify';

function FlowDiagram() {
  // Example initial nodes
  const initialNodes: NodeData[] = [
    {
      id: 'node-1',
      type: 'default',
      position: { x: 100, y: 100 },
      dimensions: { width: 200, height: 100 },
      inputs: [],
      outputs: [
        {
          id: 'output-1',
          nodeId: 'node-1',
          type: 'output',
          position: { x: 200, y: 50 }
        }
      ],
      data: { label: 'Start Node' }
    }
  ];

  // Example initial edges
  const initialEdges: EdgeData[] = [];

  const handleNodesChange = (nodes: NodeData[]) => {
    console.log('Nodes updated:', nodes);
  };

  const handleEdgesChange = (edges: EdgeData[]) => {
    console.log('Edges updated:', edges);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <EdgifyCanvas
        initialNodes={initialNodes}
        initialEdges={initialEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        width={8000}  // Optional: Custom canvas width (default: 8000)
        height={6000} // Optional: Custom canvas height (default: 6000)
      />
    </div>
  );
}
```

### 3. Interact with the Flow Diagram

#### Adding Nodes

- Click the '+' button in the controller panel
- New nodes will be added at the center of the current viewport

#### Creating Connections

1. Click and hold on a node's output handle (right side)
2. Drag to another node's input handle (left side)
3. Release to create a connection

#### Navigation

- Pan: Click and drag on empty space
- Zoom: Ctrl/Cmd + Mouse wheel
- Select Node: Click on a node
- Move Node: Drag and drop nodes
- Delete: Select node/edge and press Delete/Backspace

#### Keyboard Shortcuts

- Ctrl/Cmd + Z: Undo
- Ctrl/Cmd + Shift + Z: Redo
- Delete/Backspace: Delete selected elements

### 4. Handle State Changes

```tsx
function FlowDiagram() {
  const handleNodesChange = (nodes: NodeData[]) => {
    // State updates are debounced by default
    saveNodesToDatabase(nodes);
  };

  const handleEdgesChange = (edges: EdgeData[]) => {
    saveEdgesToDatabase(edges);
  };

  return (
    <EdgifyCanvas
      onNodesChange={handleNodesChange}
      onEdgesChange={handleEdgesChange}
    />
  );
}
```