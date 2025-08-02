import { useCanvasCreate } from "../hooks/useCanvasCreate";

export const Sidebar = () => {
  const { mutate: createCanvasRequestAPI, isPending } = useCanvasCreate();
  const handleNewCanvasReq = () => {
    const canvasName = prompt(
      "Enter a name for your new canvas:",
      "My New Project"
    );
    if (canvasName) {
      createCanvasRequestAPI(canvasName);
    }
  };

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-lg font-bold">My Canvases</h2>

        <button onClick={handleNewCanvasReq} disabled={isPending}>
          {isPending ? "Creating..." : "New Canvas &plus;"}
        </button>
      </div>
    </aside>
  );
};
