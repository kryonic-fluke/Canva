import { memo, useState, useRef, useCallback, useEffect } from "react";
import { Handle, NodeResizer, Position, type NodeProps } from "reactflow";
import { getTagColor } from "../services/getTagColor";
import { getAuth } from "firebase/auth";
import { clearEditingPresence, setEditingPresence } from "../api/canvas";
import { useParams } from "react-router-dom";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

interface ImageNodeData {
  url: string;
  width: number;
  height: number;
  path?: string;
  category?: string | null;
  onDataChange: (updates: { url?: string ,path?: string }) => void;

      onNodeResize?: (updates: { width: number; height: number }) => void;

  isBeingEditedByAnotherUser?: boolean;
}

export const ImageNode = memo(
  ({ data, id, selected }: NodeProps<ImageNodeData>) => {
    const [isLoading, setIsLoading] = useState(false);
      const[imgUri,setImgUri]= useState("");
    
    const [hasError, setHasError] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
   
  const { _id: canvasId } = useParams<{ _id: string }>();


    useEffect(() => {
     const currentUser = getAuth().currentUser;
    const userId = currentUser?.uid;

      if (selected && canvasId && userId) {
        setEditingPresence(canvasId, userId, id).catch((err) =>
          console.error("failed to set presence:", err)
        );

        return () => {
          clearEditingPresence(canvasId, userId).catch((err) =>
            console.error("failed to clear presence:", err)
          );
        };
      }
    }, [ canvasId, id,selected]);



    useEffect(() => {
      setImgUri("");
    }, [data.url]); 
    const displayUrl = imgUri || data.url;

    
const handleFileUpload = useCallback(
  (e: React.ChangeEvent<HTMLInputElement>) => { 
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImgUri(reader.result as string);
    };

    const performBackgroundUpload = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        const oldImagePath = data.path;
        if (oldImagePath) {
          const storage = getStorage();
          const oldImageRef = ref(storage, oldImagePath);
          await deleteObject(oldImageRef); 
          // console.log("Successfully deleted old image.");
        }

        const storage = getStorage();
const filePath = `canvas-images/${canvasId}/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        data.onDataChange({ url: downloadURL, path: filePath });

      } catch (error) {
        console.error("Error during file operation:", error);
        setHasError(true);
        setImgUri(""); 
        alert("Failed to upload image.");
      } finally {
        setIsLoading(false);
      }
    };

    performBackgroundUpload();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  },
  [data, canvasId]
);

    const handleUploadClick = useCallback(() => {
      fileInputRef.current?.click();
    }, []);

    const handleImageLoad = useCallback(() => {
      setIsLoading(false);
      setHasError(false);
    }, []);

    const handleImageError = useCallback(() => {
      setIsLoading(false);
      setHasError(true);
    }, []);

    const hasImage = !!data.url;
    const isBeingEditedByAnotherUser = data.isBeingEditedByAnotherUser ?? false;

    return (
      <div
        className={`
        border-1 rounded-lg shadow-md bg-white overflow-hidden relative
        transition-all duration-200
        ${selected ? "ring-2 ring-blue-400" : ""}
        ${
          isBeingEditedByAnotherUser
            ? "animate-pulse border-green-500"
            : "border-gray-300"
        }
        ${!hasImage ? "border-dashed" : ""}
        hover:shadow-lg
      `}
        style={{ width: data.width||`100%` , height:data.height|| `100%` }}
      >
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
            className={`absolute bottom-2 left-2 text-white text-xs font-semibold px-2 py-0.5 rounded-full z-10 ${getTagColor(data.category)}`}
            title={`Category: ${data.category}`}
          >
            {data.category}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />

        {hasImage && (
          <button
            onClick={handleUploadClick}
            className="absolute top-2 right-2 bg-gray-800 bg-opacity-80 text-white 
                     px-2 py-1 rounded text-xs hover:bg-opacity-100 transition-all z-10"
          >
            Change
          </button>
        )}

        <div className="w-full h-full flex items-center justify-center p-[0.3rem] ">
          {!hasImage ? (
            <button
              onClick={handleUploadClick}
              className="w-full h-full flex flex-col items-center justify-center 
                         text-gray-400 hover:bg-gray-50 transition-colors rounded-lg"
              aria-label="Upload an image"
            >
              <img src="/img/img2.png" alt="Upload placeholder" className="h-14 w-14 object-contain"/>
              <span className="text-md mt-6 font-semibold hover:text-blue-500">Click to upload image</span>
            </button>
          ) : isLoading ? (
            <div className="text-center text-gray-500">
              <div className="animate-spin text-2xl mb-2">⏳</div>
              <p className="text-sm">Uploading...</p>
            </div>
          ) : hasError ? (
            <div className="text-center text-red-500">
              <div className="text-3xl mb-2">❌</div>
              <p className="text-sm mb-2">Failed to load image</p>
              <button
                onClick={handleUploadClick}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 
                         transition-colors text-sm"
              >
                Choose Different Image
              </button>
            </div>
          ) : (
            <img
               src={displayUrl} 
              alt="User uploaded content"
              className="max-w-full max-h-full object-contain rounded-md"
              onLoad={handleImageLoad}
              onError={handleImageError}
              draggable={false}
            />
          )}
        </div>

        {isBeingEditedByAnotherUser && (
          <div
            className="absolute bottom-1 right-1 text-xs text-green-600 font-medium 
                        bg-white bg-opacity-80 px-1 rounded shadow"
            title="This node is being edited by another user"
          >
            Editing...
          </div>
        )}
      </div>
    );
  }
);