import { CanvasListItem } from './CanvasListItem';
interface Canvas {
  _id: string;
}

export const CanvasList = ({ canvases }: { canvases: Canvas[] }) => {
  return (
    <ul className="space-y-1">
      {canvases.map(canvas => (
        <CanvasListItem key={canvas._id} canvas={canvas} />
      ))}
    </ul>
  );
};