import { Fragment, useCallback, useEffect, useMemo, useRef } from "react";
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
import { Menu } from "@headlessui/react";
import { ChecklistNode } from "../components/CheckListNode";
import { StickyNote } from "../components/StickyNodes";
import { ImageNode } from "../components/ImageNode";

export const CanvasView = () => {
  const {
    nodes: rawNodes,
    setNodes,
    isLoading: isNodesLoading,
  } = useCanvasNodes();
  const { edges, setEdges, isLoading: isEdgesLoading } = useCanvasEdges();
  const { _id: canvasId } = useParams<{ _id: string }>();
  const activePresenceMap = usePresence(canvasId!);
  const currentUserId = getAuth().currentUser?.uid;
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

  //  updating a position real time, idk this is updating position real time
  const onNodeLabelChange = useCallback(
    (nodeId: string, newLabel: string) => {
      if (!canvasId || !nodeId || !newLabel) return;
      updateNodes(canvasId, nodeId, { data: { label: newLabel } });
    },
    [canvasId]
  );

  const handleImageChange = useCallback(
    (
      nodeId: string,
      updates: { url?: string; width?: number; height?: number }
    ) => {
      if (!canvasId || !nodeId) return;

      const currentNode = rawNodes.find((node) => node.id === nodeId);
      if (!currentNode) return;

      const mergedData = {
        ...currentNode.data,
        ...updates,
      };

      // optimistic update
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: mergedData }
            : node
        )
      );

      updateNodes(canvasId, nodeId, { data: mergedData }).catch((err) => {
        console.error(`Failed to update image node ${nodeId}`, err);
      });
    },
    [canvasId, rawNodes, setNodes]
  );

  const handleChecklistChange = useCallback(
    (
      nodeId: string,
      updates: {
        title?: string;
        items?: { id: string; text: string; completed: boolean }[];
      }
    ) => {
      if (!canvasId || !nodeId) return;

      const currentNode = rawNodes.find((node) => node.id === nodeId);
      if (!currentNode) return;

      const mergedData = {
        ...currentNode.data,
        ...updates,
      };

      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: mergedData }
            : node
        )
      );

      updateNodes(canvasId, nodeId, { data: mergedData }).catch((err) => {
        console.error(`Failed to update checklist node ${nodeId}`, err);
        // Revert on error - you might want to implement this
      });
    },
    [canvasId, rawNodes, setNodes]
  );

  const handleStickyChange = useCallback(
    (nodeId: string, updates: { text?: string; color?: string }) => {
      if (!canvasId || !nodeId) return;

      console.log('handleStickyChange called with:', { nodeId, updates });

      const currentNode = rawNodes.find((node) => node.id === nodeId);
      if (!currentNode) {
        console.error('Node not found:', nodeId);
        return;
      }

      const mergedData = {
        ...currentNode.data,
        ...updates,
      };

      console.log('Merged data:', mergedData);

      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: mergedData }
            : node
        )
      );

      updateNodes(canvasId, nodeId, { data: mergedData }).catch((err) => {
        console.error(`Failed to update sticky note ${nodeId}`, err);
      });
    },
    [canvasId, rawNodes, setNodes]
  );

  const hydratedNodes = useMemo(() => {
    return rawNodes.map((node) => {
      console.log("raw node:=>", node);

      const isBeingEdited = activePresenceMap.has(node.id);
      const editorId = activePresenceMap.get(node.id);
      let finalNodeData;

      switch (node.type) {
        case "checklist":
          finalNodeData = {
            ...node.data,
            onChecklistChange: handleChecklistChange
          };
          break;
        case "sticky":
          finalNodeData = {
            ...node.data,
            onStickyChange:  handleStickyChange
          };
          break;
        case "image":
          finalNodeData = {
            ...node.data,
            onImageChange:  handleImageChange
          };
          break;
        case "editableNode":
        default:
          finalNodeData = {
            ...node.data,
            onLabelChange: onNodeLabelChange,
          };
          break;
      }

      // Adding functionality to raw data
      const isBeingEditedByAnotherUser =
        isBeingEdited && editorId !== currentUserId;

      console.log("Final node data for", node.id, ":", finalNodeData);

      return {
        ...node,
        data: {
          ...finalNodeData,
          isBeingEditedByAnotherUser: isBeingEditedByAnotherUser,
        },
      };
    });
  }, [
    rawNodes,
    onNodeLabelChange,
    activePresenceMap,
    currentUserId,
    handleChecklistChange,
    handleStickyChange,
    handleImageChange,
  ]);

  const nodeTypes = useMemo(
    () => ({
      editableNode: EditableNode,
      checklist: ChecklistNode,
      sticky: StickyNote,
      image: ImageNode,
    }),
    []
  );

  // cleanup throttled function on unmount
  useEffect(() => {
    return () => {
      NodeChangeThrottle.cancel();
    };
  }, [NodeChangeThrottle]);

  const onNodesChange: (changes: NodeChange[]) => void = useCallback(
    (changes) => {
      if (!canvasId) return;
      setNodes((nds) => applyNodeChanges(changes, nds));
      
      // Updates the ui optimistically
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

  const addNode = useCallback(
    (nodeType: "editableNode" | "checklist" | "sticky" | "image") => {
      if (!canvasId) return;
      const newNodeId = `node_${+new Date()}`;
      let nodeData: any;

      switch (nodeType) {
        case "checklist":
          nodeData = {
            title: "New Checklist",
            items: [
              {
                id: `task_${+new Date()}`,
                text: "First item",
                completed: false,
              },
            ],
           
            isBeingEditedByAnotherUser: false,
          };
          break;
        case "image":
          nodeData = {
            url: "",
            width: 200,
            height: 150,
            isBeingEditedByAnotherUser: false,
          };
          break;
        case "sticky":
          nodeData = {
            text: "",
            color: "yellow",
          
            isBeingEditedByAnotherUser: false,
          };
          break;
        case "editableNode":
        default:
          nodeData = {
            label: "New Node",
           
            isBeingEditedByAnotherUser: false,
          };
          break;
      }

      // Data preparation
      const optimisticNode = {
        id: newNodeId,
        type: nodeType,
        position: { x: Math.random() * 450, y: Math.random() * 450 },
        data: nodeData,
      };
      

      setNodes((currentNodes) => [...currentNodes, optimisticNode]);
      // For instant ui feedback


      // const nodeForFirestore = {
      //     optimisticNode: optimisticNode

      // };
      createNode(canvasId, optimisticNode).catch((err) => {
        setNodes((nds) => nds.filter((n) => n.id !== optimisticNode.id));
        console.error("failed to add a node", err);
      });
    },
    [
      canvasId,
   
      setNodes,
      
   
    
    ]
  );

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

  if (isNodesLoading || isEdgesLoading) {
    return <div>Loading your canvas...</div>;
  }

  return (
    <>
      <div style={{ width: "100%", height: "100%" }} className="relative">
        <div className="absolute top-4 left-4 z-10">
          <Menu as={Fragment}>
            <div className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Add Node
                </Menu.Button>
              </div>

              <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => addNode("editableNode")}
                        className={`${
                          active ? "bg-indigo-500 text-white" : "text-gray-900"
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        Text Note
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => addNode("checklist")}
                        className={`${
                          active ? "bg-indigo-500 text-white" : "text-gray-900"
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        Checklist
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => addNode("sticky")}
                        className={`${
                          active ? "bg-indigo-500 text-white" : "text-gray-900"
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        Sticky Note
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => addNode("image")}
                        className={`${
                          active ? "bg-indigo-500 text-white" : "text-gray-900"
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        📸 Image
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </div>
          </Menu>
        </div>

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
        <button
          onClick={() => fitView()}
          className="bg-black text-white p-2 rounded-md absolute bottom-2 right-2 hover:opacity-80 hover:active:opacity-70"
        >
          Fit View
        </button>
      </div>
    </>
  );
};