import { debounce } from 'lodash';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { NodeProps } from 'reactflow';


interface ChecklistItem {
  id: string;
  text: string;

  completed: boolean;
}

export interface ChecklistNodeData {
  title: string;
  items: ChecklistItem[];
  onChecklistChange: (nodeId: string, updates: { title?: string; items?: ChecklistItem[] }) => void;
}

export const ChecklistNode: React.FC<NodeProps<ChecklistNodeData>> = ({ id, data }) => {
  const [title, setTitle] = useState(data.title ?? 'Untitled Checklist');
  const [items, setItems] = useState<ChecklistItem[]>(data.items ?? []);

  const { onChecklistChange } = data;

const debouncedParentUpdate = useMemo(
  () =>
    debounce((updates: { title?: string; items?: ChecklistItem[] }) => {
      console.log(`DEBOUNCED: Sending update for node ${id}`, updates);   
      onChecklistChange(id, updates);
    }, 500),
  [id, onChecklistChange]
);


  useEffect(() => {
    setTitle(data.title ?? 'Untitled Checklist');
    setItems(data.items ?? []);
  }, [data.title, data.items]);



  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedParentUpdate({ title: newTitle });
  };

  const handleItemTextChange = (itemId: string, newText: string) => {
    const newItems = items.map(item =>
      item.id === itemId ? { ...item, text: newText } : item
    );
    setItems(newItems);
    debouncedParentUpdate({ items: newItems });
  };

  const handleToggleItem = (itemId: string) => {
    const newItems = items.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    setItems(newItems);
    debouncedParentUpdate({ items: newItems });
  };

  const handleAddItem = () => {
    const newItem: ChecklistItem = {
      id: `task_${+new Date()}`,
      text: '',
      completed: false,
    };
    const newItems = [...items, newItem];
    setItems(newItems);
    debouncedParentUpdate({ items: newItems });
  };
  
  const handleRemoveItem = (itemId: string) => {
    const newItems = items.filter(item => item.id !== itemId);
    setItems(newItems);
    debouncedParentUpdate({ items: newItems });
  };


  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-3 shadow-md w-full h-full flex flex-col">
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        className="text-lg font-bold outline-none border-b-2 border-transparent focus:border-blue-500 mb-2"
        placeholder="Checklist Title"
      />
      <div className="flex-grow overflow-y-auto pr-1">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center group my-1">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => handleToggleItem(item.id)}
              className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <input
              type="text"
              value={item.text}
              onChange={(e) => handleItemTextChange(item.id, e.target.value)}
              className={`flex-grow outline-none bg-transparent ${item.completed ? 'line-through text-gray-500' : ''}`}
              placeholder={`Item #${index + 1}`}
            />
            <button 
                onClick={() => handleRemoveItem(item.id)}
                className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500"
            >
                ✕
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={handleAddItem}
        className="mt-2 text-left text-blue-600 hover:text-blue-800 text-sm"
      >
        + Add item
      </button>
    </div>
  );
};