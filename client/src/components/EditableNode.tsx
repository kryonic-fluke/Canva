import { useState, memo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Handle, Position, type NodeProps } from "reactflow";
import { getAuth } from "firebase/auth";
import { clearEditingPresence, setEditingPresence } from "../api/canvas";

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
    const userId = getAuth().currentUser?.uid;
 const isBeingEditedByAnotherUser = data.isBeingEditedByAnotherUser ?? false;
     useEffect(() => {
      const userId = getAuth().currentUser?.uid;
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
    }, [id, canvasId, userId, isEditing]);


     useEffect(() => {
      setLabel(data.label);
    }, [data.label]);
    
    const saveAndExit = () => {
      setIsEditing(false);

      if (label !== data.label) {
        data.onLabelChange(id, label);
      }
    };
    const handleDoubleClick = () => {
      setIsEditing(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        saveAndExit();
      }
    };

   





const nodeClasses = `
    p-4 ...
    ${isEditing ? 'border-blue-500 ...' : 'border-gray-300'}
    ${isBeingEditedByAnotherUser ? 'animate-pulse border-green-500' : ''}
`;




    return (
      <div
        onDoubleClick={handleDoubleClick}
        className={nodeClasses}
      >
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: "#555" }}
        />
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: "#555" }}
        />

        {isEditing ? (
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={saveAndExit}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full text-center outline-none"
          />
        ) : (
          <p className="text-center font-semibold">{data.label}</p>
        )}
      </div>
    );
  }
);
