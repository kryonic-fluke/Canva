import { useCanvasCreate } from "../hooks/useCanvasCreate";

export const CanvasEmptyState = () => {
    const { mutate: createCanvas, isPending } = useCanvasCreate();

    const handleCreateFirstCanvas = () => {
       
    const canvasName = prompt(
      "Enter a name for your new canvas:",
      "My New Project"
    );
    if (canvasName) {
      createCanvas(canvasName);
    }
  ;
    };

    return (
        <div className="flex items-center justify-center  h-full text-white bg-gray-800/50 rounded-lg">
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-2">Welcome to Creative Canvas!</h2>
                <p className="text-gray-400 mb-6">It looks like you don't have any canvases yet.</p>
                <button
                    onClick={handleCreateFirstCanvas}
                    disabled={isPending}
                    className="px-6 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-500 disabled:bg-gray-500"
                >
                    {isPending ? 'Creating...' : 'Create Your First Canvas +'}
                </button>
            </div>
        </div>
    );
};