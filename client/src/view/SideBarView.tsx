
import { SnapshotView } from "./Snapshotview";





export const SideBarView = ({ stats, onClose, onAnalyzeClick }) => {
  return (
    <div className="w-full h-full bg-gray-50 p-4 rounded-lg shadow-xl flex flex-col">
      <div className="flex justify-between items-center border-b pb-2 mb-4 shrink-0">
        <h2 className="text-xl font-bold text-gray-800">
          Intelligence Panel
        </h2>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-800"
          title="Close Panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        <SnapshotView stats={stats} onAnalyzeClick={onAnalyzeClick} />
      </div>
    </div>
  );
};