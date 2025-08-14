import {  useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  
  addEdge,
 
  type OnEdgesChange,
   type NodeChange,
  type Connection,
} from "reactflow";
import { throttle } from 'lodash';

import "reactflow/dist/style.css";
import { useCanvasNodes } from '../hooks/useCanvasNodes';
import { useCanvasEdges } from '../hooks/useCanvasEdges';
import { createNode, updateNodes } from "../api/canvas";
import { useParams } from "react-router-dom";


export const CanvasView = () => {
  const { nodes, setNodes, isLoading: isNodesLoading } = useCanvasNodes();
  const { edges, setEdges, isLoading: isEdgesLoading } = useCanvasEdges();
 const { _id: canvasId } = useParams<{ _id: string }>();




 const NodeChangeThrottle=useRef(
  throttle((canvasId:string,nodeId:string,position:{x:number,y:number})=>{
    updateNodes(canvasId,nodeId,{position}).catch(err=>{
      console.error("Throttled update failed",err);
      
      
    })
  },1)
 ).current;

 useEffect(()=>{
  return()=>{
    NodeChangeThrottle.cancel();
  }
 },[NodeChangeThrottle])
  const onNodesChange: (changes: NodeChange[])  =>void= useCallback(
    (changes) =>{
      if(!canvasId) return ;
       setNodes((nds) => applyNodeChanges(changes, nds))
        
       changes.forEach((change)=>{
        if(change.type==='position' &&change.position){
          NodeChangeThrottle(canvasId,change.id,change.position)

       if(change.position ){
          updateNodes(canvasId,change.id,{
            position:change.position
          }).catch(err=>console.error('final position update fialed',err))
        }

          if (change.dragging === false && change.position) {
                    updateNodes(canvasId, change.id, { position: change.position })
                        .catch(err => console.error("Final position update failed:", err));
                }



        

        }

       
       });

       
       
  
}, [canvasId, setNodes, NodeChangeThrottle]

  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );


  const addNode=useCallback(()=>{
    if(!canvasId) return;

    const newDate={
      position:{x:Math.random()*400,y:Math.random()*400},
      data:{label:'New Node'}
    }

    createNode(canvasId , newDate).catch(err=>{
      console.error("failed to add a node",err);
      
    })
  },[canvasId])

  
  const onConnect: (connection: Connection) => void = useCallback(
    (connection) => {
      setEdges((currentEdges) => addEdge(connection, currentEdges));
    },
    [setEdges]
  );

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
