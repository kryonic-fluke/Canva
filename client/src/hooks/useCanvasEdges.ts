import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { listenForEdges } from '../api/canvas'; 
import { type Edge } from 'reactflow';

export const useCanvasEdges = () => {
    const { _id: canvasId } = useParams<{ _id: string }>();
    const [edges, setEdges] = useState<Edge[]>([]);
    const [isLoading, setIsLoading] = useState(true);
 
    useEffect(() => {
        if (!canvasId) {
            setIsLoading(false);
            return;
        }
        const unsubscribe =  listenForEdges(canvasId, (newEdges:Edge[]) => {
            setEdges(newEdges);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [canvasId]);

    return { edges, setEdges, isLoading };
};