import { getAuth } from "firebase/auth";
import { memo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Handle, NodeResizer, Position, type NodeProps } from "reactflow";
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
  onNodeResize?: (updates: { width: number; height: number }) => void;
}

export const ChecklistNode = memo(
  ({ data, id, selected }: NodeProps<ChecklistNodeData>) => {
    const { _id: canvasId } = useParams<{ _id: string }>();

    const [title, setTitle] = useState(data.title ?? "Untitled");
    const [items, setItems] = useState(data.items ?? []);

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
      setTitle(data.title ?? "Untitled");
      setItems(data.items ?? []);
    }, [data.title, data.items]);

    useEffect(() => {
      const currentUser = getAuth().currentUser;
      const userId = currentUser?.uid;

      if (isEditing) {
        if (canvasId && userId) {
          setEditingPresence(canvasId, userId, id);
        }
        return () => {
          if (canvasId && userId) {
            clearEditingPresence(canvasId, userId);
          }
        };
      }
    }, [isEditing, canvasId, id]);

    const handleSave = () => {
      setIsEditing(false);
      const validItems = items.filter((item) => item.text.trim() !== "");

      const hasTitleChanged = title !== (data.title ?? "Untitled");
      const haveItemsChanged =
        JSON.stringify(validItems) !== JSON.stringify(data.items ?? []);

      if (hasTitleChanged || haveItemsChanged) {
        data.onChecklistChange?.({
          ...(hasTitleChanged && { title }),
          ...(haveItemsChanged && { items: validItems }),
        });
      }
    };

    const handleToggleItem = (itemId: string) => {
      const newItems = items.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
      setItems(newItems);
      data.onChecklistChange?.({ items: newItems });
    };

    const handleAddItem = () => {
      const newItem: ChecklistItem = {
        id: `task_${+new Date()}`,
        text: "",
        completed: false,
      };
      setItems((prev) => [...prev, newItem]);
      setIsEditing(true);
    };

    const isBeingEditedByAnotherUser = data.isBeingEditedByAnotherUser ?? false;
    const nodeClasses = `
        p-4 border-2 rounded-lg bg-white shadow-md text-gray-800 flex flex-col
        transition-all duration-200
        ${
          isBeingEditedByAnotherUser
            ? "border-green-500 animate-pulse"
            : "border-gray-200"
        }
        ${isEditing ? "border-blue-500 ring-2 ring-blue-300" : ""}
        ${selected && !isEditing ? "ring-2 ring-blue-400" : ""}
    `;

    return (
      <div className={nodeClasses} style={{ width: "100%", height: "100%" }}>
        <NodeResizer
          isVisible={selected && !isEditing}
          minWidth={220}
          minHeight={100}
          onResizeEnd={(_event, params) => {
            data.onNodeResize?.({ width: params.width, height: params.height });
          }}
        />
        <Handle type="source" position={Position.Bottom} />
        <Handle type="target" position={Position.Top} />

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsEditing(true)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
              e.currentTarget.blur();
            }
          }}
          className="w-full text-center text-lg font-bold outline-none bg-transparent mb-2 shrink-0"
          placeholder="Checklist Title"
          disabled={isBeingEditedByAnotherUser}
        />

        <div className="space-y-2 overflow-y-auto flex-grow">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-2 group">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggleItem(item.id)}
                className="form-checkbox h-4 w-4 text-blue-600 rounded shrink-0"
                disabled={isBeingEditedByAnotherUser}
              />
              <input
                value={item.text}
                onChange={(e) => {
                  setItems(
                    items.map((i) =>
                      i.id === item.id ? { ...i, text: e.target.value } : i
                    )
                  );
                }}
                onFocus={() => setIsEditing(true)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSave();
                    e.currentTarget.blur();
                  }
                }}
                className={`flex-grow outline-none bg-transparent ${
                  item.completed ? "line-through text-gray-500" : ""
                }`}
                placeholder="List item..."
                disabled={isBeingEditedByAnotherUser}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleAddItem}
          className="text-gray-500 hover:text-gray-800 mt-2 text-left pl-7 text-sm"
          disabled={isBeingEditedByAnotherUser}
        >
          + Add item
        </button>
      </div>
    );
  }
);
