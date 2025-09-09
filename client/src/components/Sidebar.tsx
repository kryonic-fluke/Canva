import { useCanvasCreate } from "../hooks/useCanvasCreate";
import { useGetCanvases } from "../hooks/usegetCanvases";
import { CanvasList } from "./CanvasList";
import { EmptyState } from "./EmptyState";

import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useLayout } from "../context/LayoutContext";
import { useState } from "react";
import { Spinner } from "./Spinner";

export const SideBar = () => {
  const { mutate: createNewCanvas, isPending: isCreating } = useCanvasCreate();
  const { data: canvases, isLoading: isLoadingCanvases } = useGetCanvases();
  const [isCreatingNewCanvas, setIsCreatingNewCanvas] = useState(false);
  const [selectedCanvasId, setSelectedCanvasId] = useState(canvases?.[0]?._id || ""); 

  const { user } = useAuth();
  const { closeSidebar } = useLayout();
  const handleNewCanvasClick = () => {
    setIsCreatingNewCanvas(true);
  };

  const handleCancelNewCanvas = () => {
    setIsCreatingNewCanvas(false);
  };

  const handleSaveNewCanvas = (canvasName: string) => {
    if (canvasName) {
      createNewCanvas(canvasName, {
        onSuccess: () => {
          setIsCreatingNewCanvas(false);
        },
      });
    } else {
      setIsCreatingNewCanvas(false);
    }
  };

  //  const handleLoginClick = () => {
  //   if (closeSidebar) {
  //     closeSidebar();
  //   }
  // };

  const hasCanvases = canvases && canvases.length > 0;

  return (
    <aside className="bg-gray-800 text-white p-4  h-full w-[18rem]">
      {user ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">My Canvases</h2>
            {(hasCanvases || !isCreatingNewCanvas) &&(
              <button
                onClick={handleNewCanvasClick}
                disabled={isCreatingNewCanvas || isCreating}
                className="text-xl bg-blue-600 rounded px-2"
              >
                +
              </button>
            )}
          </div>

          <div className=" flex flex-col overflow-y-auto">
            {isLoadingCanvases  ?(
              <div className="flex justify-center my-2">
                <Spinner size="sm" />
              </div>
            ): (hasCanvases || isCreatingNewCanvas) ? (
              // 1. Show the list if it has items OR if we are adding the first item.
              <CanvasList
                canvases={canvases || []}
                isCreating={isCreatingNewCanvas}
                isSaving={isCreating} 
                onSave={handleSaveNewCanvas}
                onCancel={handleCancelNewCanvas}
                selectedCanvasId={selectedCanvasId}
                onSelectCanvas={setSelectedCanvasId}
              />
            ) : (
              <EmptyState
                onAction={handleNewCanvasClick}
              />
            )}
          </div>
        </>):
            (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
          <p className="text-gray-400 mb-6">
            Log in to manage your projects and start collaborating.
          </p>
          <Link
            to="/login"
            className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            onClick={closeSidebar}
          >
            Login / Sign Up
          </Link>
        </div>
      )}
    </aside>
  );
};
