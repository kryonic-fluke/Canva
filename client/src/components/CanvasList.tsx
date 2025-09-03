
import { CanvasType } from "../types/canvases";
import { CanvasListItem } from "./CanvasListItem";

interface CanvasListProps {
  canvases: CanvasType[];
}

export const CanvasList = ( {canvases}: CanvasListProps ) => {
  return (
    <ul className="space-y-1">
      {canvases.map(canvas => (
        <CanvasListItem key={canvas._id} canvas={canvas} />
      ))}
    </ul>
  );
};