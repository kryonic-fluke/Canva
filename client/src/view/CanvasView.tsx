import {  useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type OnNodesChange,
  type OnEdgesChange,
  type Connection,
} from "reactflow";

import "reactflow/dist/style.css";
import { useCanvasNodes } from '../hooks/useCanvasNodes';
import { useCanvasEdges } from '../hooks/useCanvasEdges';
const initialNodes: Node[] = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "Hello" } },
  { id: "2", position: { x: 100, y: 100 }, data: { label: "World" } },
];


export const CanvasView = () => {
  const { nodes, setNodes, isLoading: isNodesLoading } = useCanvasNodes();
  const { edges, setEdges, isLoading: isEdgesLoading } = useCanvasEdges();

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  let id = initialNodes.length;
  const getNextId = () => `${++id}`;

  const handleAdd = useCallback(() => {
    const newNode = {
      id: getNextId(),
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: "New Node" },
    };

    setNodes((currentNodes) => [...currentNodes, newNode]);
  }, [getNextId]);

  const onConnect: (connection: Connection) => void = useCallback(
    (connection) => {
      setEdges((currentEdges) => addEdge(connection, currentEdges));
    },
    []
  );

  //connection is object containing info source an target node
 if (isNodesLoading || isEdgesLoading) {
    return <div>Loading your canvas...</div>;
  }
  return (
    <div style={{ width: "100%", height: "100%" }} className="relative">
      <button
        onClick={handleAdd}
        className="bg-green-400 px-6 py-2 font-medium active:opacity-5 hover:bg-green-600 absolute top-2 left-0 z-20"
      >
        Add
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};
