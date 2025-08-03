interface EmptyStateProps {
  onAction: () => void;
  isCreating: boolean;
}

export const EmptyState = ({ onAction, isCreating }: EmptyStateProps) => {
  return (
    <div className="text-center p-4 border-2 border-dashed border-gray-600 rounded-lg">
      <h3 className="text-md font-semibold">No Canvases Yet</h3>
      <p className="text-sm text-gray-400 mt-1 mb-3">
        Let's get your ideas flowing.
      </p>
      <button onClick={onAction} disabled={isCreating} className="w-full bg-gray-500 px-[10px] py-1 font-semibold rounded-md translate-y-2 hover:outline-1">
        {isCreating ? 'Creating...' : ' Create Your First Canvas +'}
      </button>
    </div>
  ); 
};