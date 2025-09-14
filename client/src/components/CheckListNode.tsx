import { debounce } from "lodash";
import React, { useState, useEffect, useMemo, useRef } from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position, NodeResizer } from "reactflow";
import { getAuth } from "firebase/auth";

import { clearEditingPresence, setEditingPresence } from "../api/canvas";
import { useParams } from "react-router-dom";

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ChecklistNodeData {
  title: string;
  items: ChecklistItem[];
  height: number;
  width: number;
  category?: string | null;
  onDataChange: (userupdates: {
    title?: string;
    items?: ChecklistItem[];
  }) => void;
  onNodeResize?: (size: { width: number; height: number }) => void;
  isBeingEditedByAnotherUser?: boolean; //
}

export const ChecklistNode: React.FC<NodeProps<ChecklistNodeData>> = ({
  id,
  data,
  selected,
}) => {
  const [title, setTitle] = useState(data.title ?? "Untitled Checklist");

  const [items, setItems] = useState<ChecklistItem[]>(data.items ?? []);
  const [isEditing, setIsEditing] = useState(false);
  const { onDataChange, onNodeResize } = data;
  const { _id: canvasId } = useParams<{ _id: string }>();
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const currentUser = getAuth().currentUser;
    const userId = currentUser?.uid;

    if (isEditing && canvasId && userId) {
      setEditingPresence(canvasId, userId, id).catch((err) =>
        console.error("Failed to set presence:", err)
      );

      return () => {
        clearEditingPresence(canvasId, userId).catch((err) =>
          console.error("Failed to clear presence:", err)
        );
      };
    }
  }, [isEditing, canvasId, id]);
  const debouncedParentUpdate = useMemo(
    () =>
      debounce((updates: { title?: string; items?: ChecklistItem[] }) => {
        console.log(`🔵 CHILD [${id}]: SENDING PAYLOAD`, updates);
        onDataChange(updates);
      }, 500),
    [id, onDataChange]
  );

  useEffect(() => {
    return () => {
      debouncedParentUpdate.cancel();
    };
  }, [debouncedParentUpdate]);

  useEffect(() => {
    setTitle(data.title ?? "Untitled Checklist");
    setItems(data.items ?? []);
  }, [data.title, data.items]);

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditing]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedParentUpdate({ title: newTitle });
  };

  const handleItemTextChange = (itemId: string, newText: string) => {
    const newItems = items.map((item) =>
      item.id === itemId ? { ...item, text: newText } : item
    );
    setItems(newItems);
    debouncedParentUpdate({ items: newItems });
  };

  const handleToggleItem = (itemId: string) => {
    const newItems = items.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    setItems(newItems);
    debouncedParentUpdate({ items: newItems });
  };

  const handleAddItem = () => {
    const newItem: ChecklistItem = {
      id: `task_${+new Date()}`,
      text: "",
      completed: false,
    };
    const newItems = [...items, newItem];
    setItems(newItems);
    debouncedParentUpdate({ items: newItems });
  };
  //  const handleClick = () => {
  //   if (!data.isBeingEditedByAnotherUser) {
  //     setIsEditing(true);
  //   }
  // };

  const handleEnterEditing = () => {
    if (!data.isBeingEditedByAnotherUser) {
      setIsEditing(true);
    }
  };

  const handleExitAndSave = () => {
    debouncedParentUpdate.flush();
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "INPUT") {
      handleExitAndSave();
    }
  };
  const handleRemoveItem = (itemId: string) => {
    const newItems = items.filter((item) => item.id !== itemId);
    setItems(newItems);
    debouncedParentUpdate({ items: newItems });
  };
  const isBeingEditedbyAnotherUser = data.isBeingEditedByAnotherUser ?? false;
  const nodeClasses = `p-4 border-2 rounded-lg shadow-md bg-white
    flex flex-col
    transition-all duration-200
    ${isEditing ? "ring-2 ring-blue-300 border-blue-400" : ""}
    ${isBeingEditedbyAnotherUser ? "animate-pulse ring-2 ring-green-400" : ""}
  `;
  return (
    <div
      className={nodeClasses}
      onDoubleClick={handleEnterEditing}
      style={{
        width: data.width || "100%",
        height: data.height || "100%",
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          handleExitAndSave();
        }
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={200}
        minHeight={150}
        onResizeEnd={(_event, params) => {
          onNodeResize?.({ width: params.width, height: params.height });
        }}
      />
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-400"
      />
      <div className=" flex flex-col flex-grow  bg-white overflow-hidden p-1">
        <input
          type="text"
          value={title}
          ref={titleInputRef}
          onChange={handleTitleChange}
          disabled={!isEditing}
          className="text-lg font-bold outline-none border-b-2 border-transparent focus:border-blue-500 mb-2 w-full"
          placeholder="Checklist Title"
        />
        <div className="flex-grow overflow-y-auto pr-2 p-2">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center group my-1">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggleItem(item.id)}
                className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                disabled={!isEditing}
              />

              <input
                type="text"
                value={item.text}
                onChange={(e) => handleItemTextChange(item.id, e.target.value)}
                className={`flex-grow outline-none bg-transparent ${
                  item.completed ? "line-through text-gray-500" : ""
                }`}
                placeholder={`Item #${index + 1}`}
                disabled={!isEditing}
              />

              <button
                onClick={() => handleRemoveItem(item.id)}
                disabled={!isEditing}
                className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={handleAddItem}
          disabled={!isEditing}
          className="mt-2 text-left text-blue-600 hover:text-blue-800 text-sm"
        >
          + Add item
        </button>
      </div>
    </div>
  );
};
