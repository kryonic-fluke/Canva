import { useCanvasCreate } from "../hooks/useCanvasCreate";
import { useGetCanvases } from "../hooks/usegetCanvases";
import { CanvasList } from "./CanvasList";
import { EmptyState } from "./EmptyState";

import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useLayout } from "../context/LayoutContext";


export const SideBar = () => {
  const { mutate: createNewCanvas, isPending: isCreating } = useCanvasCreate();
  const { data: canvases, isLoading: isLoadingCanvases } = useGetCanvases();
  const { user } = useAuth();
  const { closeSidebar } = useLayout();
  const handleNewCanvasClick = () => {
    const canvasName = prompt(
      "Enter a name for your new canvas:",
      "My New Project"
    );
    if (canvasName) {
      createNewCanvas(canvasName);
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
            {hasCanvases && (
              <button
                onClick={handleNewCanvasClick}
                disabled={isCreating}
                className="text-xl bg-blue-600 rounded px-2"
              >
                +
              </button>
            )}
          </div>

          <div className=" flex flex-col overflow-y-auto">
            {isLoadingCanvases && "Loading"}
            {hasCanvases && !isLoadingCanvases && (
              <CanvasList canvases={canvases} />
            )}
            {!hasCanvases && !isLoadingCanvases && (
              <EmptyState
                onAction={handleNewCanvasClick}
                isCreating={isCreating}
              />
            )}
          </div>
        </>
      ) : (
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
