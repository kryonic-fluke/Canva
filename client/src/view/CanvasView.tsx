import "reactflow/dist/style.css";
import ReactFlow, {
  Controls,
  Background,
  type NodeChange,
  type Node,
  type EdgeChange,
  useReactFlow,
  type Edge,
} from "reactflow";
import { useParams } from "react-router-dom";
import { useReducer, useEffect, useState, useMemo, useCallback } from "react";
import { syncCanvasToFirestore } from "../api/fireStoreApi";

import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { v4 as uuidv4 } from "uuid";
import { canvasReducer, type CanvasState } from "../reducers/canavasReducer";
import { throttle } from "lodash";

const initialState: CanvasState = {
  name: "Loading...",
  nodes: [],
  edges: [],
};

interface LocalState {
  pendingOperations: Set<string>;
}

export const CanvasView = () => {
  const { canvasId } = useParams<{ canvasId: string }>();
  const [state, dispatch] = useReducer(canvasReducer, initialState);
  const { fitView } = useReactFlow();
  
  const [localState, setLocalState] = useState<LocalState>({
    pendingOperations: new Set()
  });

  // Create a stable sync function that uses current state
  const syncToFirestore = useCallback(async (nodes: Node[], edges: Edge[], operationIds: string[]) => {
    if (!canvasId) return;
    
    console.log("SYNCING TO FIRESTORE");
    try {
      await syncCanvasToFirestore(canvasId, { nodes, edges });
      
      // Remove completed operations from pending set
      setLocalState(prev => ({
        pendingOperations: new Set([...prev.pendingOperations].filter(id => !operationIds.includes(id)))
      }));
    } catch (error) {
      console.error("Failed to sync:", error);
      // Remove failed operations from pending set
      setLocalState(prev => ({
        pendingOperations: new Set([...prev.pendingOperations].filter(id => !operationIds.includes(id)))
      }));
    }
  }, [canvasId]);

  // Throttled sync function
  const throttledSync = useMemo(
    () => throttle(syncToFirestore, 300),
    [syncToFirestore]
  );

  // Listen to Firestore changes
  useEffect(() => {
    if (!canvasId) return;
    
    const docRef = doc(db, "canvases", canvasId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        // Only update from remote if we don't have pending local operations
        if (localState.pendingOperations.size === 0) {
          dispatch({
            type: "SET_CANVAS",
            payload: docSnap.data() as CanvasState,
          });
        }
      } else {
        console.error("Canvas not found");
      }
    });
    
    return () => unsubscribe();
  }, [canvasId, localState.pendingOperations.size]);

  // Handle real-time sync for continuous operations
  useEffect(() => {
    if (state.nodes.length > 0 && canvasId && localState.pendingOperations.size > 0) {
      const operationIds = Array.from(localState.pendingOperations);
      throttledSync(state.nodes, state.edges, operationIds);
    }
  }, [state.nodes, state.edges, canvasId, localState.pendingOperations, throttledSync]);

  const onNodesChange = (changes: NodeChange[]) => {
    // Handle drag operations
    const dragChanges = changes.filter(change => change.type === 'position' && change.dragging === false);
    
    if (dragChanges.length > 0) {
      // Add drag operations to pending set
      const dragNodeIds = dragChanges.map(change => change.id);
      setLocalState(prev => ({
        pendingOperations: new Set([...prev.pendingOperations, ...dragNodeIds])
      }));
    }
    
    dispatch({ type: "ON_NODES_CHANGE", payload: changes });
  };

  const onEdgesChange = (changes: EdgeChange[]) => {
    dispatch({ type: "ON_EDGES_CHANGE", payload: changes });
  };

  const handleNodesDelete = async (deletedNodes: Node[]) => {
    if (!canvasId) return;
    
    const deletedNodeIds = deletedNodes.map(node => node.id);
    
    // Add to pending operations
    setLocalState(prev => ({
      pendingOperations: new Set([...prev.pendingOperations, ...deletedNodeIds])
    }));
    
    // Update local state immediately
    dispatch({ type: "DELETE_NODES", payload: deletedNodes });
    
    try {
      // Sync to Firestore - use current state after deletion
      const updatedNodes = state.nodes.filter(node => !deletedNodeIds.includes(node.id));
      await syncCanvasToFirestore(canvasId, { 
        nodes: updatedNodes, 
        edges: state.edges 
      });
      
      // Remove from pending operations
      setLocalState(prev => ({
        pendingOperations: new Set([...prev.pendingOperations].filter(id => !deletedNodeIds.includes(id)))
      }));
      
    } catch (error) {
      console.error("Failed to delete nodes:", error);
      // Rollback on error - add nodes back
      dispatch({ type: "ADD_MULTIPLE_NODES", payload: deletedNodes });
      
      // Remove from pending operations
      setLocalState(prev => ({
        pendingOperations: new Set([...prev.pendingOperations].filter(id => !deletedNodeIds.includes(id)))
      }));
    }
  };

  const handleAddNode = async () => {
    if (!canvasId) return;

    const newNode: Node = {
      id: uuidv4(),
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: { label: "New Node" },
    };

    // Add to pending operations
    setLocalState(prev => ({
      pendingOperations: new Set([...prev.pendingOperations, newNode.id])
    }));

    // Update local state immediately (optimistic update)
    dispatch({ type: "ADD_NODE", payload: newNode });

    try {
      // Sync to Firestore
      const updatedNodes = [...state.nodes, newNode];
      await syncCanvasToFirestore(canvasId, { 
        nodes: updatedNodes, 
        edges: state.edges 
      });
      
      // Remove from pending operations
      setLocalState(prev => ({
        pendingOperations: new Set([...prev.pendingOperations].filter(id => id !== newNode.id))
      }));
      
    } catch (error) {
      console.error("Failed to add node:", error);
      
      // Fixed: Use correct variable name and action type
      dispatch({ type: "REMOVE_NODE", payload: newNode.id });
      
      // Remove from pending operations
      setLocalState(prev => ({
        pendingOperations: new Set([...prev.pendingOperations].filter(id => id !== newNode.id))
      }));
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div className="flex flex-end">
        <button
          onClick={handleAddNode}
          disabled={localState.pendingOperations.size > 10}
          className="bg-green-500 text-white px-3 py-2 font-semibold rounded-md hover:-translate-y-[1px] transition-all duration-300 ease-in-out hover:shadow-[0px_10px_20px_black] active:bg-green-700 hover:bg-green-600 disabled:opacity-50"
        >
          Add Node {localState.pendingOperations.size > 0 && `(${localState.pendingOperations.size} syncing...)`}
        </button>
      </div>

      <ReactFlow
        nodes={state.nodes.map((node) => ({
          ...node,
          style: {
            ...node.style,
            border: "3px solid red",
            background: "rgba(255, 0, 0, 0.2)",
          },
        }))}
        edges={state.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={handleNodesDelete}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};