// src/components/StickyNote.tsx
import { memo, useState, useEffect, useRef } from "react";
import { Handle, NodeResizer, Position, type NodeProps } from "reactflow";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { setEditingPresence, clearEditingPresence } from "../api/canvas";
import { getTagColor } from '../services/getTagColor';
interface StickyNoteData {
  text: string;
  color: 'yellow' | 'pink' | 'blue' | 'green' | 'purple';
  category?: string | null;
onDataChange: (updates: { text?: string; color?: string }) => void;  
onNodeResize?: (updates: { width: number; height: number }) => void;
  isBeingEditedByAnotherUser?: boolean;
}

const colorClasses = {
  yellow: 'bg-yellow-200 border-yellow-300',
  pink: 'bg-pink-200 border-pink-300', 
  blue: 'bg-blue-200 border-blue-300',
  green: 'bg-green-200 border-green-300',
  purple: 'bg-purple-200 border-purple-300',
};

export const StickyNote = memo(({ data, id,selected }: NodeProps<StickyNoteData>) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const [text, setText] = useState(data.text || '');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { _id: canvasId } = useParams<{ _id: string }>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    if (!isEditing) {
      setText(data.text || '');
    }
  }, [data.text, isEditing]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (!data.isBeingEditedByAnotherUser) {
      setIsEditing(true);
    }
  };

  const saveAndExit = () => {
    setIsEditing(false);
    console.log("text===>",text);
    
    data.onDataChange( { text });
  };

  const handleColorChange = (newColor: keyof typeof colorClasses) => {
    console.log("color here  🌈=>", newColor);
    data.onDataChange({ color: newColor });
    setShowColorPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" ) {
      e.preventDefault();
      saveAndExit();
    }
  
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showColorPicker && !(event.target as Element)?.closest('.color-picker-container')) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showColorPicker]);

  const isBeingEditedByAnotherUser = data.isBeingEditedByAnotherUser ?? false;
  const baseClasses = colorClasses[data.color] || colorClasses.yellow;
 
  const nodeClasses = `
    ${baseClasses}
    p-4 border-2 rounded-lg shadow-md
    flex flex-col
   cursor-grab
    transition-all duration-200
    ${isEditing ? "ring-2 ring-blue-300 border-blue-400" : ""}
    ${isBeingEditedByAnotherUser ? "animate-pulse ring-2 ring-green-400" : ""}
    ${!isEditing && !isBeingEditedByAnotherUser ? "hover:shadow-lg cursor-pointer" : ""}
  `;

  return (
    <div className={nodeClasses} style={{ 
  width: "100%",
  height:  "100%"
}}>
       <NodeResizer
        isVisible={selected}
        minWidth={150}
        minHeight={100}
        onResizeEnd={(_event, params) => {
          data.onNodeResize?.({ width: params.width, height: params.height });
        }}
      />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
       {data.category && (
        <div 
          className={`absolute bottom-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full z-10 ${getTagColor(data.category)}`}
          title={`Category: ${data.category}`}
        >
          {data.category}
        </div>
      )}
      <div className="absolute top-1 right-1 color-picker-containe ">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="w-4 h-4 rounded-full bg-gray-400 hover:bg-gray-600 opacity-60 hover:opacity-100 transition-all"
          title="Change color"
        >
        </button>
        
        {showColorPicker && (
          <div className="absolute top-6 right-0 bg-white border rounded-lg p-2 shadow-lg z-10 flex gap-1">
            {(Object.keys(colorClasses) as Array<keyof typeof colorClasses>).map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`w-6 h-6 rounded-full border-2 ${colorClasses[color]} 
                  ${data.color === color ? 'border-gray-800' : 'border-gray-300'}
                  hover:scale-110 transition-transform`}
                title={`Change to ${color}`}
              />
            ))}
          </div>
        )}
      </div>

      <div onDoubleClick={handleDoubleClick} className="h-full w-full  flex flex-grow items-center">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={saveAndExit}
            onKeyDown={handleKeyDown}
            className="w-full h-full resize-none outline-none bg-transparent text-sm placeholder-gray-500"
            placeholder="Type your note here... "
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