// src/components/ImageNode.tsx
import { memo, useState } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

interface ImageNodeData {
  url: string;
  width: number;
  height: number;
  onImageChange: (nodeId: string, updates: { 
    url?: string; 
    width?: number; 
    height?: number; 
  }) => void;
  isBeingEditedByAnotherUser?: boolean;
}

export const ImageNode = memo(({ data, id }: NodeProps<ImageNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [urlInput, setUrlInput] = useState(data.url || '');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    
    setIsLoading(true);
    setHasError(false);
    setIsEditing(false);
    
    data.onImageChange(id, { url: urlInput.trim() });
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUrlSubmit();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setUrlInput(data.url || '');
    }
  };

  const isBeingEditedByAnotherUser = data.isBeingEditedByAnotherUser ?? false;
  const width = data.width || 200;
  const height = data.height || 150;

  const nodeClasses = `
    border-2 rounded-lg shadow-md bg-white
    transition-all duration-200 relative
    ${isBeingEditedByAnotherUser ? "animate-pulse border-green-500" : "border-gray-300"}
    ${!data.url ? "border-dashed" : ""}
  `;

  return (
    <div className={nodeClasses} style={{ width: `${width}px`, height: `${height}px` }}>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />

      <button
        onClick={() => setIsEditing(!isEditing)}
        className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded text-xs hover:bg-gray-600 z-10"
      >
        {isEditing ? "Cancel" : "Edit"}
      </button>

      {isEditing && (
        <div className="absolute top-8 left-2 right-2 z-10">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleUrlSubmit}
            placeholder="Paste image URL..."
            className="w-full px-2 py-1 border rounded text-sm outline-none focus:border-blue-500"
            autoFocus
          />
        </div>
      )}

      <div className="w-full h-full flex items-center justify-center p-2">
        {!data.url ? (
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">🖼️</div>
            <p className="text-sm">Click Edit to add image</p>
          </div>
        ) : isLoading ? (
          <div className="text-center text-gray-500">
            <div className="animate-spin text-2xl mb-2">⏳</div>
            <p className="text-sm">Loading...</p>
          </div>
        ) : hasError ? (
          <div className="text-center text-red-500">
            <div className="text-4xl mb-2">❌</div>
            <p className="text-sm">Failed to load image</p>
            <button 
              onClick={() => setIsEditing(true)}
              className="text-xs underline mt-1"
            >
              Try different URL
            </button>
          </div>
        ) : (
          <img
            src={data.url}
            alt="Node content"
            className="max-w-full max-h-full object-contain rounded"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </div>

      <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-400 cursor-se-resize opacity-50 hover:opacity-100">
        <div className="w-full h-full flex items-center justify-center text-xs text-white">
          ⌟
        </div>
      </div>
    </div>
  );
});