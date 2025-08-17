
import { useState, memo, useEffect } from 'react';
import { Handle, Position,type NodeProps } from 'reactflow';

interface EditableNodeData {
  label: string;
  onLabelChange:(nodeId: string, newLabel: string) => void
}

export const EditableNode = memo(({ data ,id}: NodeProps<EditableNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);


   const saveAndExit = () => {
    setIsEditing(false);
    // Only save if the label has actually changed
    if (label !== data.label) {
      data.onLabelChange(id, label);
    }
  };
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
     saveAndExit();

    }
  };


  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);
  
  return (
    <div onDoubleClick={handleDoubleClick} className="p-3 border-2 border-gray-400 rounded-lg bg-white shadow-md min-w-[150px]">
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      
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
});