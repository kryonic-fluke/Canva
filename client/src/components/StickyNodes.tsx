import { memo, useState, useEffect, useRef } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { setEditingPresence, clearEditingPresence } from "../api/canvas";

interface StickyNoteData {
  text: string;
  color: 'yellow' | 'pink' | 'blue' | 'green' | 'purple';
  onStickyChange: (nodeId: string, updates: { text?: string; color?: string }) => void;
  isBeingEditedByAnotherUser?: boolean;
}

const colorClasses = {
  yellow: 'bg-yellow-200 border-yellow-300',
  pink: 'bg-pink-200 border-pink-300', 
  blue: 'bg-blue-200 border-blue-300',
  green: 'bg-green-200 border-green-300',
  purple: 'bg-purple-200 border-purple-300',
};

export const StickyNote = memo(({ data, id }: NodeProps<StickyNoteData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.text || '');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { _id: canvasId } = useParams<{ _id: string }>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const currentUser = getAuth().currentUser;
    const userId = currentUser?.uid;

    if (isEditing) {
      if (canvasId && userId) {
        setEditingPresence(canvasId, userId, id).catch((err) =>
          console.error("Failed to set presence:", err)
        );
      }

      return () => {
        if (canvasId && userId) {
          clearEditingPresence(canvasId, userId).catch((err) =>
            console.error("Failed to clear presence:", err)
          );
        }
      };
    }
  }, [isEditing, canvasId, id]);

  useEffect(() => {
    setText(data.text || '');
  }, [data.text]);

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const saveAndExit = () => {
    setIsEditing(false);
    if (text !== data.text) {
      data.onStickyChange(id, { text });
    }
  };

  const handleColorChange = (newColor: string) => {
    data.onStickyChange(id, { color: newColor });
    setShowColorPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      // Allow line breaks with Shift+Enter
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      saveAndExit();
    }
  };

  const isBeingEditedByAnotherUser = data.isBeingEditedByAnotherUser ?? false;
  const baseClasses = colorClasses[data.color] || colorClasses.yellow;
  
  const nodeClasses = `
    ${baseClasses}
    p-4 border-2 rounded-lg shadow-md
    w-48 h-32 relative
    transition-all duration-200
    ${isEditing ? "ring-2 ring-blue-300 border-blue-400" : ""}
    ${isBeingEditedByAnotherUser ? "animate-pulse ring-2 ring-green-400" : ""}
    ${!isEditing ? "hover:shadow-lg cursor-pointer" : ""}
  `;

  return (
    <div className={nodeClasses}>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
      
      {/* Color picker button */}
      <div className="absolute top-1 right-1">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="w-4 h-4 rounded-full bg-gray-400 hover:bg-gray-600 opacity-60 hover:opacity-100"
        >
        </button>
        
        {showColorPicker && (
          <div className="absolute top-6 right-0 bg-white border rounded-lg p-2 shadow-lg z-10 flex gap-1">
            {Object.keys(colorClasses).map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`w-6 h-6 rounded-full border-2 ${colorClasses[color as keyof typeof colorClasses]} 
                  ${data.color === color ? 'border-gray-800' : 'border-gray-300'}
                  hover:scale-110 transition-transform`}
              />
            ))}
          </div>
        )}
      </div>

      <div onDoubleClick={handleDoubleClick} className="h-full flex items-center">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={saveAndExit}
            onKeyDown={handleKeyDown}
            className="w-full h-full resize-none outline-none bg-transparent text-sm placeholder-gray-500"
            placeholder="Double-click to edit..."
          />
        ) : (
          <p className="text-sm text-gray-800 whitespace-pre-wrap break-words overflow-hidden">
            {data.text || "Double-click to edit..."}
          </p>
        )}
      </div>
    </div>
  );
});