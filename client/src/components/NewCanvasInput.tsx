import { useState, useEffect, useRef } from 'react';
import { Spinner } from './Spinner'; // Adjust path if necessary

interface NewCanvasInputProps {
  isSaving: boolean;
  onSave: (name: string) => void;
  onCancel: () => void;
}

export const NewCanvasInput = ({ isSaving, onSave, onCancel }: NewCanvasInputProps) => {
  const [name, setName] = useState('My New Project');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSave(name);
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <li className="my-2 p-3 bg-gray-700 rounded-lg shadow-md ">
      <div className="flex  flex-col items-center  ">
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSaving}
          className="flex-grow bg-gray-800 text-white rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className='flex  items-center gap-5 justify-between mt-4'>
 <button
          onClick={() => onSave(name)}
          disabled={isSaving || !name}
          className="px-3 py-1 text-sm font-medium bg-transparent border-2 border-gray-200 text-white rounded-lg hover:text-green-500  disabled:opacity-50  transition-all duration-400 ease-in-out"
        >
          {isSaving ? <Spinner size="sm" variant="light" /> : 'Create'}
        </button>
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="px-3 py-1 text-sm font-medium bg-transparent border-2 border-gray-200 text-white rounded-lg  hover:text-red-600 disabled:opacity-50  transition-all duration-400 ease-in-out"
        >
          Cancel
        </button>
        </div>
       
      </div>
    </li>
  );
};