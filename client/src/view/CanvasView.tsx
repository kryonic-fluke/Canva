import { act, useCallback, useEffect, useMemo, useRef } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  type OnEdgesChange,
  type NodeChange,
  type Connection,
  useReactFlow,
} from "reactflow";
import { throttle } from "lodash";
import "reactflow/dist/style.css";
import { useCanvasNodes } from "../hooks/useCanvasNodes";
import { useCanvasEdges } from "../hooks/useCanvasEdges";
import {
  createEdge,
  createNode,
  deleteEdge,
  deleteNode,
  updateNodes,
} from "../api/canvas";
import { useParams } from "react-router-dom";
import { EditableNode } from "../components/EditableNode";
import { usePresence } from "../hooks/usePresence";
import { getAuth } from "firebase/auth";

export const CanvasView = () => {
  const {
    nodes: rawNodes,
    setNodes,
    isLoading: isNodesLoading,
  } = useCanvasNodes();
  const { edges, setEdges, isLoading: isEdgesLoading } = useCanvasEdges();
  const { _id: canvasId } = useParams<{ _id: string }>();
  const activePresenceMap  = usePresence(canvasId!);
const currentUserId = getAuth().currentUser?.uid
  const NodeChangeThrottle = useRef(
    throttle(
      (
        canvasId: string,
        nodeId: string,
        position: { x: number; y: number }
      ) => {
        updateNodes(canvasId, nodeId, { position }).catch((err) => {
          console.error("Throttled update failed", err);
        });
      },
      100
    )
  ).current;

  const onNodeLabelChange = useCallback(
    (nodeId: string, newLabel: string) => {
      if (!canvasId || !nodeId || !newLabel) return;
      updateNodes(canvasId, nodeId, { data: { label: newLabel } });
    },
    [canvasId]
  );

  const hydratedNodes = useMemo(() => {
    return rawNodes.map((node) => {

       const isBeingEdited = activePresenceMap.has(node.id);
        const editorId  = activePresenceMap.get(node.id)
      
 const isBeingEditedByAnotherUser = isBeingEdited && (editorId !== currentUserId);
      return {
        ...node,

        data: {
          ...node.data,
          onLabelChange: onNodeLabelChange,
           isBeingEditedByAnotherUser: isBeingEditedByAnotherUser,
        },
      };
    });
  }, [rawNodes, onNodeLabelChange,activePresenceMap,currentUserId]);

  const nodeTypes = useMemo(() => ({ editableNode: EditableNode }), []);
  //its a memoized function
  useEffect(() => {
    return () => {
      NodeChangeThrottle.cancel();
    };
  }, [NodeChangeThrottle]);

  const onNodesChange: (changes: NodeChange[]) => void = useCallback(
    (changes) => {
      if (!canvasId) return;
      setNodes((nds) => applyNodeChanges(changes, nds));

      changes.forEach((change) => {
        if (change.type === "position" && change.position) {
          NodeChangeThrottle(canvasId, change.id, change.position);

          if (change.dragging === false && change.position) {
            NodeChangeThrottle.flush();
            updateNodes(canvasId, change.id, {
              position: change.position,
            }).catch((err) =>
              console.error("Final position update failed:", err)
            );
          }
        }

        if (change.type === "remove") {
          deleteNode(canvasId, change.id).catch((err) =>
            console.error("Failed to delete node:", err)
          );
        }
      });
    },
    [canvasId, setNodes, NodeChangeThrottle]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      if (!canvasId) return;
      setEdges((eds) => applyEdgeChanges(changes, eds));
      changes.forEach((change) => {
        if (change.type === "remove") {
          deleteEdge(canvasId, change.id).catch((err) =>
            console.error("Failed to delete edge:", err)
          );
        }
      });
    },
    [canvasId, setEdges]
  );

  const addNode = useCallback(() => {
    if (!canvasId) return;
    const optimisticNode = {
      id: `node_${+new Date()}`,
      type: "editableNode",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: "New Node", onLabelChange: onNodeLabelChange, isBeingEditedByAnotherUser: false, },
    };
    setNodes((currentNodes) => [...currentNodes, optimisticNode]);
    const { data, ...nodeProps } = optimisticNode;
    const { onLabelChange: _,isBeingEditedByAnotherUser: __, ...sanitizedData } = data;
    const nodeForFirestore = {
      ...nodeProps,
      
      data: sanitizedData,
    };
    createNode(canvasId, nodeForFirestore).catch((err) => {
      setNodes((nds) => nds.filter((n) => n.id !== optimisticNode.id));

      console.error("failed to add a node", err);
    });
  }, [canvasId, onNodeLabelChange, setNodes]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!canvasId) {
        console.error("onConnect called before canvasId was available.");
        return;
      }
      console.log(`Creating edge for canvas: ${canvasId}`);
      createEdge(canvasId, connection).catch((err) => {
        console.error("Failed to create edge in database:", err);
      });
    },
    [canvasId]
  );
const { fitView } = useReactFlow();

  //connection is object containing info source an target node
  if (isNodesLoading || isEdgesLoading) {
    return <div>Loading your canvas...</div>;
  }
  return (
    <div style={{ width: "100%", height: "100%" }} className="relative">
      <button
        onClick={addNode}
        className="bg-green-400 px-6 py-2 font-medium active:opacity-5 hover:bg-green-600 absolute top-2 left-0 z-20"
      >

        Add
      </button>

      <ReactFlow
        nodes={hydratedNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
      >
        <Controls />
        <Background />
      </ReactFlow>
      <button onClick={() => fitView()} className="bg-black text-white p-2 rounded-md absolute bottom-2 right-2 hover:opacity-80 hover:active:opacity-70">Fit View</button>
    </div>
  );
};
