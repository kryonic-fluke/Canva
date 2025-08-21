import {  Fragment, useCallback, useEffect, useMemo, useRef } from "react";
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
//for updating a position real time 
  const onNodeLabelChange = useCallback(
    (nodeId: string, newLabel: string) => {
      if (!canvasId || !nodeId || !newLabel) return;
      updateNodes(canvasId, nodeId, { data: { label: newLabel } });
    },
    [canvasId]
  );



const handleChecklistChange = useCallback((
    nodeId: string, 
    updates: {
        title?: string;
        items?: { id: string; text: string; completed: boolean }[];
    }
) => {
    if (!canvasId || !nodeId) return;
    
    const currentNode = rawNodes.find(node => node.id === nodeId);
    if (!currentNode) return;
    
    const mergedData = {
        ...currentNode.data, 
        ...updates        
    };
    
    updateNodes(canvasId, nodeId, { data: mergedData })
      .catch(err => console.error(`Failed to update checklist node ${nodeId}`, err));

}, [canvasId, rawNodes]); 

const handleStickyChange = useCallback((
  nodeId: string,
  updates: { text?: string; color?: string }
) => {
  if (!canvasId || !nodeId) return;
  
  const currentNode = rawNodes.find(node => node.id === nodeId);
  if (!currentNode) return;
  
  const mergedData = {
    ...currentNode.data,
    ...updates
  };
  updateNodes(canvasId, nodeId, { data: mergedData })
    .catch(err => console.error(`Failed to update sticky note ${nodeId}`, err));
}, [canvasId, rawNodes]);

  const hydratedNodes = useMemo(() => {
    return rawNodes.map((node) => {
      console.log("nodes here ===>",node);
      
      const isBeingEdited = activePresenceMap.has(node.id);
      const editorId = activePresenceMap.get(node.id);
     let finalNodeData;
        switch (node.type) {
            case "checklist":
                finalNodeData = {
                    ...node.data,
                    onChecklistChange: (updates) => handleChecklistChange(node.id, updates),
                };
                break;
                 case "sticky":
    finalNodeData = {
      ...node.data,
      onStickyChange: (updates) => handleStickyChange(node.id, updates),
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

      //adding functoinality to raw data
      const isBeingEditedByAnotherUser =
        isBeingEdited && editorId !== currentUserId;
     
// console.log("final data😡",finalNodeData);

      return {
        ...node,
        data: {
          ...finalNodeData,
          isBeingEditedByAnotherUser: isBeingEditedByAnotherUser,
        },
      };
    });
  }, [rawNodes, onNodeLabelChange, activePresenceMap, currentUserId,handleChecklistChange,handleStickyChange]);

  const nodeTypes = useMemo(() => ({ editableNode: EditableNode ,checklist:ChecklistNode,sticky:StickyNote}), []);
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
   //updates the ui optimistically 
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
    (nodeType: "editableNode" | "checklist"|"sticky") => {
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
             onChecklistChange: (updates) => handleChecklistChange(newNodeId, updates),
            isBeingEditedByAnotherUser: false,
          };
          break;
          case "sticky":
      nodeData = {
        text: "",
        color: "yellow",
        onStickyChange: (updates) => handleStickyChange(newNodeId, updates),
        isBeingEditedByAnotherUser: false,
      };
      break;

        case "editableNode":
        default:
          nodeData = {
            label: "New Node",
            onLabelChange: onNodeLabelChange,
            isBeingEditedByAnotherUser: false,
          };
          break;
      }
      //data preparation

      const optimisticNode = {
        id: newNodeId,
        type: nodeType,
        position: { x: Math.random() * 450, y: Math.random() * 450 },
        data: nodeData,
      };
const { data, ...nodeProps } = optimisticNode;


      setNodes((currentNodes) => [...currentNodes, optimisticNode]);
//for instant ui feedback
const { 
    onLabelChange, 
    onChecklistChange, 
    ...dataForFirestore 
} = data;

     const nodeForFirestore = {
    ...nodeProps,         
    data: dataForFirestore, 
};
      createNode(canvasId, nodeForFirestore).catch((err) => {
        setNodes((nds) => nds.filter((n) => n.id !== optimisticNode.id));
        console.error("failed to add a node", err);
      });
    },
    [canvasId, onNodeLabelChange, setNodes,handleChecklistChange,handleStickyChange]
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
