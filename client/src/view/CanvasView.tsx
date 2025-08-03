import 'reactflow/dist/style.css';
import ReactFlow, { Controls, Background, type NodeChange, 
    type EdgeChange } from 'reactflow';
import { useParams } from 'react-router-dom';
import { useReducer, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { addNodeToFirestore, updateNodesInFirestore } from '../api/fireStoreApi'; 
import { v4 as uuidv4 } from 'uuid';
import { canvasReducer, type CanvasState } from '../reducers/canavasReducer';

const initialState: CanvasState = {
 name: 'Loading...',
 nodes: [],
 edges: [],
};

export const CanvasView = () => {
 const { canvasId } = useParams<{ canvasId: string }>();
 const [state, dispatch] = useReducer(canvasReducer, initialState);

 useEffect(() => {
   if (!canvasId) return;
   const docRef = doc(db, 'canvases', canvasId);
   const unsubscribe = onSnapshot(docRef, (docSnap) => {
     if (docSnap.exists()) {
       dispatch({ type: 'SET_CANVAS', payload: docSnap.data() as CanvasState });
     } else {
       console.error("Canvas not found");
     }
   });
   return () => unsubscribe();
 }, [canvasId]);

const handleAddNode = async () => {
  if (!canvasId) return;

  const newNode: Node = {
    id: uuidv4(), 
    position: { x: Math.random() * 500, y: Math.random() * 500 }, 
    data: { label: 'New Node' },
  };

  try {
    dispatch({ type: 'ADD_NODE', payload: newNode });

    await addNodeToFirestore(canvasId, newNode);

  } catch (error) {
    console.error("Failed to add node:", error);
  }
};

const onNodeDragStop = (event, node) => {
    // We get the new position of the node that was just dragged
    const newNodes = state.nodes.map((n) => {
        if (n.id === node.id) {
            return {
                ...n,
                position: node.position,
            };
        }
        return n;
    });

    updateNodesInFirestore(canvasId!, newNodes);
};
 
 const onNodesChange = (changes: NodeChange[]) => dispatch({ type: 'ON_NODES_CHANGE', payload: changes });
 const onEdgesChange = (changes: EdgeChange[]) => dispatch({ type: 'ON_EDGES_CHANGE', payload: changes });

 return (
   <div style={{ width: '100%', height: '100%' }}>
    <button onClick={handleAddNode} className="...">
      Add Node
    </button>
     <ReactFlow
       nodes={state.nodes}
       edges={state.edges}
       onNodesChange={onNodesChange}
       onEdgesChange={onEdgesChange}
          onNodeDragStop={onNodeDragStop}
       fitView
     >
       <Controls />
       <Background />
     </ReactFlow>
   </div>
 );
};