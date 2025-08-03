import { useCanvasCreate } from "../hooks/useCanvasCreate";
import { useGetCanvases } from "../hooks/usegetCanvases";
import { CanvasList } from './CanvasList';
import { EmptyState } from './EmptyState';
// import { Spinner } from './Spinner'; // Assume you have a simple spinner component

export const SideBar = () => {
  const { mutate: createNewCanvas, isPending: isCreating } = useCanvasCreate();
  const { data: canvases, isLoading: isLoadingCanvases } = useGetCanvases();

  const handleNewCanvasClick = () => {
    const canvasName = prompt("Enter a name for your new canvas:", "My New Project");
    if (canvasName) {
      createNewCanvas(canvasName);
    }
  };

  console.log(canvases);
  
  const hasCanvases = canvases && canvases.length > 0;

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">My Canvases</h2>
        {hasCanvases && (
          <button onClick={handleNewCanvasClick} disabled={isCreating} className="text-xl bg-blue-600 rounded px-2">+</button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoadingCanvases && "Loading"}
        {hasCanvases && !isLoadingCanvases && <CanvasList canvases={canvases} />}
        {!hasCanvases && !isLoadingCanvases && <EmptyState onAction={handleNewCanvasClick} isCreating={isCreating} />}
      </div>
    </aside>
  );
};
