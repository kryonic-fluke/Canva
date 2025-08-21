import { getAuth } from "firebase/auth";
import { memo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Handle, Position, type NodeProps } from "reactflow";
import { clearEditingPresence, setEditingPresence } from "../api/canvas";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface ChecklistNodeData {
  title: string;
  items: ChecklistItem[];
  isBeingEditedByAnotherUser?: boolean;
  onChecklistChange?: (updates: {
    title?: string;
    items?: ChecklistItem[];
  }) => void;
}

export const ChecklistNode = memo(
  ({ data, id }: NodeProps<ChecklistNodeData>) => {
    const { _id: canvasId } = useParams<{ _id: string }>();
    const [title, setTitle] = useState(data.title ?? "Untitled");
    const [items, setItems] = useState(data.items ?? []);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    useEffect(() => {
      setTitle(data.title ?? "Untitled");
      setItems(data.items ?? []);
    }, [data.title, data.items]);

    useEffect(() => {
      const currentUser = getAuth().currentUser;
      const userId = currentUser?.uid;

      if (focusedInput) {
        if (canvasId && userId) {
          setEditingPresence(canvasId, userId, id);
        }
        return () => {
          if (canvasId && userId) {
            clearEditingPresence(canvasId, userId);
          }
        };
      }
    }, [focusedInput, canvasId, id]);

    const handleTitleChange = (newTitle: string) => {
      setTitle(newTitle);
      data.onChecklistChange?.({ title: newTitle });
    };

    const handleToggleItem = (itemId: string) => {
      const newItems = items.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
      setItems(newItems);
      data.onChecklistChange?.({ items: newItems });
    };

    const handleItemTextChange = (itemId: string, newText: string) => {
      const newItems = items.map((item) =>
        item.id === itemId ? { ...item, text: newText } : item
      );
      setItems(newItems);
      data.onChecklistChange?.({ items: newItems });
    };

    const handleAddItem = () => {
      const newItem: ChecklistItem = {
        id: `task_${+new Date()}`,
        text: "", // Start with blank text
        completed: false,
      };
      const newItems = [...items, newItem];
      setItems(newItems);
      data.onChecklistChange?.({ items: newItems });
    };

    const isBeingEditedByAnotherUser = data.isBeingEditedByAnotherUser ?? false;
    const nodeClasses = `
        p-4 border-2 rounded-lg bg-white shadow-md w-64 text-gray-800
        transition-all duration-200
        ${
          isBeingEditedByAnotherUser
            ? "border-green-500 animate-pulse"
            : "border-gray-200"
        }
        ${focusedInput ? "border-blue-500 ring-2 ring-blue-200" : ""}
    `;

    return (
      <div className={nodeClasses}>
        <Handle type="source" position={Position.Bottom} />
        <Handle type="target" position={Position.Top} />

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            if (title !== (data.title ?? "Untitled")) {
              handleTitleChange(title);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          onFocus={() => setFocusedInput("title")}
          className="w-full text-center text-lg font-bold outline-none bg-transparent mb-2"
          placeholder="Checklist Title"
        />

        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center space-x-2 group">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggleItem(item.id)}
                className="..."
              />
              <input
                value={item.text}
                onChange={(e) => handleItemTextChange(item.id, e.target.value)}
                onFocus={() => setFocusedInput(item.id)}
                onBlur={() => setFocusedInput(null)}
                className={`flex-grow outline-none bg-transparent ${
                  item.completed ? "line-through text-gray-500" : ""
                }`}
                placeholder="List item"
              />
              {index === items.length - 1 && (
                <button
                  onClick={handleAddItem}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-800"
                >
                  +
                </button>
              )}
            </div>
          ))}
          {items.length === 0 && (
            <button
              onClick={handleAddItem}
              className="text-gray-500 hover:text-gray-800"
            >
              + Add item
            </button>
          )}
        </div>
      </div>
    );
  }
);
