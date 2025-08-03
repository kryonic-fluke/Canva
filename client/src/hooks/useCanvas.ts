

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase'; 
import { type Node, type Edge } from 'reactflow'; 

interface CanvasData {
  name: string;
  nodes: Node[];
  edges: Edge[];
}

export const useCanvas = (canvasId: string) => {
  const [canvasData, setCanvasData] = useState<CanvasData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!canvasId) {
      setIsLoading(false);
      return;
    }

    const docRef = doc(db, 'canvases', canvasId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as CanvasData;
        console.log("Canvas data updated from Firestore:", data);
        setCanvasData(data);
      } else {
        console.error("No such canvas document!");
        setError(new Error("Canvas not found."));
      }
      setIsLoading(false);
    }, (err) => {
      console.error("Firestore listen failed:", err);
      setError(err);
      setIsLoading(false);
    });

 
    return () => unsubscribe();

  }, [canvasId]);

  return { canvasData, isLoading, error };
};