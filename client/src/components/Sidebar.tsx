import { useCanvasCreate } from "../hooks/useCanvasCreate";

export const Sidebar = () => {
  const { mutate: createCanvasRequestAPI, isPending } = useCanvasCreate();
  const handleNewCanvasReq = () => {
    const canvasName = prompt(
      "Enter a name for your new canvas:",
      "My New Project"
    );
    if (canvasName) {
      createCanvasRequestAPI(canvasName,{
        onSuccess:(canvasName)=>{
            console.log("new canvas:", canvasName.name,"sucessfully created");
            
        }
      });
    }
  };

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-lg font-bold">My Canvases</h2>

        <button onClick={handleNewCanvasReq} disabled={isPending} className="bg-blue-400 px-3 py-3 hover:bg-blue-500 active:bg-blue-700">
  {isPending ? "Creating..." : "New Canvas +"}
</button>
      </div>
    </aside>
  );
};
