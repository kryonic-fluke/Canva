import { Fragment, useCallback, useEffect, useMemo, useRef,
  useState,
} from "react";
import ReactFlow, {  Controls,  Background,  applyNodeChanges,  applyEdgeChanges,  type OnEdgesChange,  type NodeChange,  type Node,  type Connection,  useReactFlow,  Edge,
} from "reactflow";
import { throttle } from "lodash";
import "reactflow/dist/style.css";
import { useCanvasNodes } from "../hooks/useCanvasNodes";
import { useCanvasEdges } from "../hooks/useCanvasEdges";
import {createEdge,createNode, updateNodes, } from "../api/canvas";
import { useParams } from "react-router-dom";
import { EditableNode } from "../components/EditableNode";
import { usePresence } from "../hooks/usePresence";
import { getAuth } from "firebase/auth";
import { Menu } from "@headlessui/react";
import { ChecklistNode } from "../components/CheckListNode";
import { StickyNote } from "../components/StickyNodes";
import { ImageNode } from "../components/ImageNode";
import { useCategorizeNodes } from "../hooks/useCategorize";
import { useCanvasStats } from "../hooks/useCanvasStats";
import { SnapshotView } from "./Snapshotview";
import { useDeleteNode } from "../hooks/useDeleteNode";
import { useDeleteEdge } from "../hooks/useDeleteEdge";
import { ConfirmModal } from "../components/ConfirmModalProps";
import { Spinner } from "../components/Spinner";
import { deleteObject, getStorage, ref } from "firebase/storage";

export const CanvasView = () => {
  const {  nodes: rawNodes,  setNodes,  isLoading: isNodesLoading,} = useCanvasNodes();
  const { edges, setEdges, isLoading: isEdgesLoading } = useCanvasEdges();
  const { _id: canvasId } = useParams<{ _id: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 const { mutate: deleteNode } = useDeleteNode();
  const { mutate: deleteEdge } = useDeleteEdge();
  const [itemsToDelete, setItemsToDelete] = useState<{ nodes: Node[], edges: Edge[] } | null>(null);
  const stats = useCanvasStats();

  const { getNodes } = useReactFlow();
  const { mutate: categorize, isPending: isCategorizing } = useCategorizeNodes();

  const activePresenceMap = usePresence(canvasId!);
  const currentUserId = getAuth().currentUser?.uid;



   const handleNodesDelete = useCallback((nodesToDelete: Node[]) => {
    setItemsToDelete({ nodes: nodesToDelete, edges: [] });
  }, []);

  const handleEdgesDelete = useCallback((edgesToDelete: Edge[]) => {
    setItemsToDelete({ nodes: [], edges: edgesToDelete });
  }, []);

  const deletionMessage = useMemo(() => {
  if (!itemsToDelete) return "";

  const nodeCount = itemsToDelete.nodes.length;
  const edgeCount = itemsToDelete.edges.length;

  if (nodeCount > 0 && edgeCount > 0) {
    return `Are you sure you want to delete ${nodeCount} node(s) and ${edgeCount} edge(s)?`;
  }
  
  if (nodeCount > 0) {
    return `Are you sure you want to delete ${nodeCount} node(s)?`;
  }

  if (edgeCount > 0) {
    return `Are you sure you want to delete ${edgeCount} edge(s)?`;
  }
  
  return "Are you sure? This action cannot be undone.";

}, [itemsToDelete]);



const performDeletion = async () => { 
  if (!itemsToDelete || !canvasId) return;

  for (const node of itemsToDelete.nodes) {
    if (
      node.type === 'image' && 
      node.data.path
    ) {
      try {
        const storage = getStorage();
        const imageRef = ref(storage, node.data.path);
        await deleteObject(imageRef);
        console.log(`Successfully deleted image for node ${node.id}`);
      } catch (error) {
        console.warn(`Failed to delete image for node ${node.id}:`, error);
      }
    }

    deleteNode({ canvasId, nodeId: node.id });
  }
  
  for (const edge of itemsToDelete.edges) {
    deleteEdge({ canvasId, edgeId: edge.id });
  }

  setItemsToDelete(null);
};
   const cancelDeletion = () => {
    setItemsToDelete(null);
  };


  const NodeChangeThrottle = useRef(
    throttle( (   canvasId: string,   nodeId: string,   position: { x: number; y: number } ) => {   updateNodes(canvasId, nodeId, { position }).catch((err) => {
          console.error("Throttled update failed", err);
        });
      },
      100
    )
  ).current;

  //  updating a position real time, idk this is updating position real time
  const handleCategorizeClick = () => {
    const allNodes = getNodes();

    const selectedNodes = allNodes.filter(
      (node) =>
        node.selected &&
        ["sticky", "editableNode", "checklist"].includes(node.type!)
    );

    if (selectedNodes.length > 0) {
      categorize(selectedNodes);
    } else {
      alert(
        "Please select one or more text, sticky, or checklist nodes to categorize."
      );
    }
  };

  const handleNodeResize = useCallback(
    (nodeId: string, style: { width: number; height: number }) => {
      if (!canvasId || !nodeId) return;

      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId
            ? { ...node, width: style.width, height: style.height }
            : node
        )
      );
      const firestorePayload = {
        width: style.width,
        height: style.height,
      };
      updateNodes(canvasId, nodeId, firestorePayload).catch((err) => {
        console.error(`error occured during resizing for node: ${nodeId}`, err);
      });
    },
    [canvasId, setNodes]
  );

  // const onNodeLabelChange = useCallback(
  //   (nodeId: string, newLabel: string) => {
  //     if (!canvasId || !nodeId || !newLabel) return;
  //     updateNodes(canvasId, nodeId, { data: { label: newLabel } });
  //   },
  //   [canvasId]
  // );

  // const handleImageChange = useCallback(
  //   (nodeId: string, updates: { url?: string }) => {
  //     if (!canvasId || !nodeId) return;

  //     const currentNode = rawNodes.find((node) => node.id === nodeId);
  //     if (!currentNode) return;

  //     const mergedData = {
  //       ...currentNode.data,
  //       ...updates,
  //     };

  //     // optimistic update
  //     setNodes((prevNodes) =>
  //       prevNodes.map((node) =>
  //         node.id === nodeId ? { ...node, data: mergedData } : node
  //       )
  //     );

  //     updateNodes(canvasId, nodeId, { data: mergedData }).catch((err) => {
  //       console.error(`Failed to update image node ${nodeId}`, err);
  //     });
  //   },
  //   [canvasId, rawNodes, setNodes]
  // );

  const handleNodeDataChange = useCallback(
    (nodeId: string, updates: object) => {
      if (!nodeId || !canvasId ) return;
      setNodes((currentNodes) =>
        currentNodes.map((node) => {
          if (node.id !== nodeId) return node;
          const updatedData = { ...node.data, ...updates };
          return { ...node, data: updatedData };
        })
      );

      const nodeForFirestore = rawNodes.find((n) => n.id === nodeId);
      if (nodeForFirestore) {
        const mergedData = { ...nodeForFirestore.data, ...updates };
        updateNodes(canvasId, nodeId, { data: mergedData }).catch((err) => {
          console.error(
            `[handleNodeDataChange] Failed to update node ${nodeId} in Firestore.`,
            err
          );
        });
      }
    },
    [rawNodes, setNodes, canvasId]
  );

  // const handleStickyChange = useCallback(
  //   (nodeId: string, updates: { text?: string; color?: string }) => {
  //     if (!canvasId || !nodeId) return;

  //     console.log("handleStickyChange called with:", { nodeId, updates });

  //     const currentNode = rawNodes.find((node) => node.id === nodeId);
  //     if (!currentNode) {
  //       console.error("Node not found:", nodeId);
  //       return;
  //     }

  //     const mergedData = {
  //       ...currentNode.data,
  //       ...updates,
  //     };

  //     console.log("Merged data:", mergedData);

  //     setNodes((prevNodes) =>
  //       prevNodes.map((node) =>
  //         node.id === nodeId ? { ...node, data: mergedData } : node
  //       )
  //     );

  //     updateNodes(canvasId, nodeId, { data: mergedData }).catch((err) => {
  //       console.error(`Failed to update sticky note ${nodeId}`, err);
  //     });
  //   },
  //   [canvasId, rawNodes, setNodes]
  // );
const hydratedNodes = useMemo(() => {
    return rawNodes.map((node) => {
      const isBeingEdited = activePresenceMap.has(node.id);
      const editorId = activePresenceMap.get(node.id);
      
      const commonNodeDataProps = {
        onDataChange: (updates: object) => handleNodeDataChange(node.id, updates),
        
        onNodeResize: (style: { width: number; height: number }) => handleNodeResize(node.id, style),
        
        isBeingEditedByAnotherUser: isBeingEdited && editorId !== currentUserId,
        
        canvasId: canvasId, 
      };

      return {
        ...node,
        data: {
          ...node.data,
          ...commonNodeDataProps,
        },
        style: { width: node.width ?? 200, height: node.height ?? 150 },
      };
    });
  }, [    rawNodes,    activePresenceMap,    currentUserId,    handleNodeDataChange,     handleNodeResize,    canvasId,  ]);

  const nodeTypes = useMemo(
    () => ({   editableNode: EditableNode,   checklist: ChecklistNode,   sticky: StickyNote,   image: ImageNode, }),
    []
  );

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
       
      });
    },
    [canvasId, setNodes, NodeChangeThrottle]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      if (!canvasId) return;
      setEdges((eds) => applyEdgeChanges(changes, eds));
     
    },
    [canvasId, setEdges]
  );

  const addNode = useCallback(
    (nodeType: "editableNode" | "checklist" | "sticky" | "image") => {
      if (!canvasId ) return;
      const newNodeId = `node_${+new Date()}`;
      let nodeData;

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
              
            category: null,
            isBeingEditedByAnotherUser: false,
          };
          break;
        case "image":
          nodeData = {
            url: "",
            isBeingEditedByAnotherUser: false,
            category: null,
            path: ""
          };

          break;
        case "sticky":
          nodeData = {
            text: "",
            color: "yellow",
            isBeingEditedByAnotherUser: false,
            category: null,
          };

          break;
        case "editableNode":
        default:
          nodeData = {
            label: "",
            isBeingEditedByAnotherUser: false,
            category: null,
          };

          break;
      }
      const width = 300;
      const height = 200;
      // Data preparation
      const optimisticNode = {
        id: newNodeId,
        type: nodeType,
        position: { x: 250, y: 50 },
        width,
        height,
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
    [canvasId, setNodes]
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
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900">
      <Spinner size="lg" variant="light" text="Loading Canvas..." />
    </div>
  );
}

  return (
    <>
     <ConfirmModal 
        isOpen={itemsToDelete !== null}
        title="Confirm Deletion"
        message={deletionMessage}
        onConfirm={performDeletion}
        onCancel={cancelDeletion}
        confirmText="Delete"
      />
      <div style={{ width: "100%", height: "100%" }} className="relative">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
          <button
            onClick={handleCategorizeClick}
            disabled={isCategorizing}
            className="flex items-center justify-center gap-3 bg-blue-600 text-white font-semibold px-4 py-2 rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:shadow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          >
          <p>
            {isCategorizing ? "Thinking..." : "Categorize"}
            </p>  
            <img src="/img/ai.png" className="h-[1.8rem] w-[1.5rem]"/>
          </button>
        </div>

        <div className="absolute top-2 right-6 z-10">
          <button
            className="px-3 py-2 bg-purple-600 text-700 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:shadow-700 transition-all"
            onClick={() => setIsSidebarOpen(true)}
          >
              <img src="/img/stats4.png" className="h-[1.8rem] w-[1.5rem]  "/>
          </button>
        </div>

        <div className="absolute top-2 left-4 z-10">
          <Menu as={Fragment}>
            <div className="relative inline-block text-left">
              <div>
                <Menu.Button className=" bg-indigo-500  hover:bg-indigo-600 focus:outline-none   justify-center w-full rounded-md border shadow-sm px-3 py-1  text-lg text-white   font-semibold   focus:ring-indigo-500 translate-all duration-300 ease-in-out">
                    +
                </Menu.Button>
              </div>




              <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left bg-gray-200 rounded-md divide-y divide-gray-100  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none translate-all duration-300 ease-in-out">
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
                        📸 Image/Gif
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </div>
          </Menu>
        </div>

        <div
          className={`absolute top-0 right-0 h-full bg-white shadow-lg z-20 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "w-96 p-2" : "w-0"
          }`}
        >
          {isSidebarOpen && (
            <SnapshotView stats={stats} setIsSidebarOpen={setIsSidebarOpen} />
          )}
        </div>

        <ReactFlow
          nodes={hydratedNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
           onNodesDelete={handleNodesDelete}
        onEdgesDelete={handleEdgesDelete}
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
