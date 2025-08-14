import { Navigate } from 'react-router-dom';
import { useGetCanvases } from '../hooks/usegetCanvases'; 
import { CanvasEmptyState } from '../view/CanvasView/CanvasEmptyState';

export const AppIndexRedirect = () => {
    const { data: canvases, isLoading, isError } = useGetCanvases();

    if (isLoading) {
        return <div>Loading workspace...</div>;
    }

    if (isError) {
        return <div>Error loading your workspace.</div>;
    }
    
    if (canvases && canvases.length > 0) {
        const firstCanvasId = canvases[0]._id;
        return <Navigate to={`canvas/${firstCanvasId}`} replace />;
    }
        return <CanvasEmptyState />;
};