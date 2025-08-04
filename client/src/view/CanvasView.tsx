import "reactflow/dist/style.css";
import ReactFlow, {
  Controls,
  Background,
  type NodeChange,
  type Node,
  type EdgeChange,
  applyNodeChanges,
} from "reactflow";
import { useParams } from "react-router-dom";
import { useReducer, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import {
  addNodeToFirestore,
  updateNodesInFirestore,
} from "../api/fireStoreApi";
import { v4 as uuidv4 } from "uuid";
import { canvasReducer, type CanvasState } from "../reducers/canavasReducer";
import { throttle } from "lodash";

const initialState: CanvasState = {
  name: "Loading...",
  nodes: [],
  edges: [],
};

const realTimethrottle = throttle((canvasId: string, nodes: Node[]) => {
  updateNodesInFirestore(canvasId, nodes); //caps the function call to 2 sec
}, 200);

export const CanvasView = () => {
  const { canvasId } = useParams<{ canvasId: string }>();
  const [state, dispatch] = useReducer(canvasReducer, initialState);

  useEffect(() => {
    //updates the ui after addition of deletion of the node
    if (!canvasId) return;
    const docRef = doc(db, "canvases", canvasId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        dispatch({
          type: "SET_CANVAS",
          payload: docSnap.data() as CanvasState,
        });
      } else {
        console.error("Canvas not found");
      }
    });
    return () => unsubscribe();
  }, [canvasId]);

  const onNodesChange = (changes: NodeChange[]) => {
    if (!canvasId) return;

    dispatch({ type: "ON_NODES_CHANGE", payload: changes });

    //  calculate what the next state WILL be
    const nextNodes = applyNodeChanges(changes, state.nodes);

    // 3. call our throttled function with the future state
    realTimethrottle(canvasId, nextNodes);
  };

  //this is the first thing, canvas id is created
  const handleAddNode = async () => {
    if (!canvasId) return;

    const newNode: Node = {
      id: uuidv4(), //new id generated
      position: { x: Math.random() * 500, y: Math.random() * 500 }, //random position assigned on spawn
      data: { label: "New Node" }, //label
    };

    try {
      dispatch({ type: "ADD_NODE", payload: newNode }); // new node is then dispatched

      await addNodeToFirestore(canvasId, newNode);
    } catch (error) {
      console.error("Failed to add node:", error);
    }
  };

  // const onNodeDragStop = (event, node:Node) => {

  //     const newNodes = state.nodes.map((n) => {  //when the ndoe is droped my user , its new coordiantes are updated on the server
  //         if (n.id === node.id) {
  //             return {
  //                 ...n,
  //                 position: node.position,
  //             };
  //         }
  //         return n;
  //     });

  //     updateNodesInFirestore(canvasId!, newNodes);
  // };

  //action dispatcher for nodes change
  const onEdgesChange = (changes: EdgeChange[]) =>
    dispatch({ type: "ON_EDGES_CHANGE", payload: changes }); //action dispatcher for edges change

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <button
        onClick={handleAddNode}
        className="bg-green-500 text-white px-3 py-2 font-semibold rounded-md hover:-translate-y-[1px] transition-all duration-300 ease-in-out hover:shadow-[0px_10px_20px_black] active:bg-green-700 hover:bg-green-600"
      >
        Add Node
      </button>
      <ReactFlow
        nodes={state.nodes}
        edges={state.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        // onNodeDragStop={onNodeDragStop}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};
