import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { listenForNodes } from "../api/canvas"; // Adjust path
import { type Node } from 'reactflow';

export const useCanvasNodes = () => {
  const { _id: canvasId } = useParams<{ _id: string }>();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!canvasId) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = listenForNodes(canvasId, (newNodes:Node[]) => {
      setNodes(newNodes);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [canvasId]);

  return { nodes, setNodes, isLoading }; 
};