// src/components/EmptyState.tsx

interface EmptyStateProps {
  onAction: () => void;
}

export const EmptyState = ({ onAction }: EmptyStateProps) => {
  return (
    <div className="text-center mt-10 p-4 border-2 border-dashed border-gray-600 rounded-lg">
      <h3 className="text-lg font-semibold text-white">No Canvases Yet</h3>
      <p className="text-sm text-gray-400 mt-1 mb-4">
        Let's get your ideas flowing.
      </p>
      <button 
        onClick={onAction} 
        className="w-full bg-blue-600 px-4 py-2 font-semibold rounded-md hover:bg-blue-700 transition-colors"
      >
        Create Your First Canvas
      </button>
    </div>
  ); 
};