// src/components/EditableNode.tsx

import { memo, useState, useEffect, useRef } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { setEditingPresence, clearEditingPresence } from "../api/canvas"; // Assuming your api calls are here

interface EditableNodeData {
  label: string;
  onLabelChange: (nodeId: string, newLabel: string) => void;
  isBeingEditedByAnotherUser?: boolean;
}

export const EditableNode = memo(
  ({ data, id }: NodeProps<EditableNodeData>) => {
    const [isEditing, setIsEditing] = useState(false);
    const [label, setLabel] = useState(data.label);
    const { _id: canvasId } = useParams<{ _id: string }>();
    const inputRef = useRef<HTMLInputElement>(null);

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
            console.log("CLEANUP: useEffect cleanup is running!");
            clearEditingPresence(canvasId, userId).catch((err) =>
              console.error("Failed to clear presence:", err)
            );
          }
        };
      }
    }, [isEditing, canvasId, id]); 

    useEffect(() => {
      setLabel(data.label);
    }, [data.label]);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
          
        }
    }, [isEditing]);

    

    const handleDoubleClick = () => {
      setIsEditing(true);
    };


    const saveAndExit = () => {
            console.log("ACTION: saveAndExit triggered. Setting isEditing to false."); 

      setIsEditing(false);
      if (label !== data.label) {
        data.onLabelChange(id, label);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        saveAndExit();
      }
    };
    
    const isBeingEditedByAnotherUser = data.isBeingEditedByAnotherUser ?? false;
    const nodeClasses = `bg-white
      p-4 border-2 rounded-lg  shadow-md
      transition-colors duration-200
      ${ isEditing ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-300" }
      ${ isBeingEditedByAnotherUser ? "animate-pulse border-green-500" : "" }
    `;

    return (
      <div className={nodeClasses}>
        <Handle type="source" position={Position.Bottom} />
        <Handle type="target" position={Position.Top} />
        
        <div onDoubleClick={handleDoubleClick}>
            {isEditing ? (
            <input
                ref={inputRef}
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onBlur={saveAndExit} 
                onKeyDown={handleKeyDown}
                className="w-full text-center outline-none bg-transparent"
            />
            ) : (
            <p className="text-center font-semibold ">{data.label}</p>
            )}
        </div>
      </div>
    );
  }
);