
import { CanvasType } from "../types/canvases";
import { CanvasListItem } from "./CanvasListItem";
import { NewCanvasInput } from "./NewCanvasInput";

interface CanvasListProps {
  canvases: CanvasType[];
  isCreating: boolean; 
    isSaving: boolean; 

  onSave: (name: string) => void; 
  onCancel: () => void;
    selectedCanvasId: string;
  onSelectCanvas: (id: string) => void;
}

export const CanvasList = ({ canvases, isCreating, isSaving, onSave, onCancel, selectedCanvasId, onSelectCanvas }: CanvasListProps ) => {
  return (
    <ul className="space-y-1">
      {isCreating && <NewCanvasInput onSave={onSave} onCancel={onCancel} isSaving={isSaving} />}

      {canvases.map(canvas => (
        <CanvasListItem key={canvas._id} canvas={canvas}            isSelected={canvas._id === selectedCanvasId}  onSelect={onSelectCanvas}
 />
      ))}
    </ul>
  );
};