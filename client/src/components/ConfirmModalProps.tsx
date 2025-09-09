
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
}

export const ConfirmModal = ({   isOpen,   title,   message,   onConfirm,   onCancel,  confirmText = "Confirm",}: ConfirmModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      
      <div className="bg-zinc-900  rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all ease-in-out duration-300"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ease-in-out duration-300"
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
};