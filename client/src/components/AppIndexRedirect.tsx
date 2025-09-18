import { Navigate } from 'react-router-dom';
import { Spinner } from './Spinner'; 
import { useGetCanvases } from '../hooks/usegetCanvases';
import { CanvasEmptyState } from '../view/CanvasEmptyState';

export const AppIndexRedirect = () => {
    const { data: canvases, isLoading } =useGetCanvases();
    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <Spinner text="Loading workspace..." size="lg" />
            </div>
        );
    }
    if (canvases && canvases.length > 0) {
        const firstCanvasId = canvases[0]._id;
        return <Navigate to={`canvas/${firstCanvasId}`} replace />;
    }
    return <CanvasEmptyState />;
};