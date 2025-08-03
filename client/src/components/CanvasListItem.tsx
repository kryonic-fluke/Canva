import { Link } from 'react-router-dom';

// This defines the shape of the 'canvas' prop
interface CanvasListItemProps {
  canvas: {
    _id: string;
    name: string;
  };
}

export const CanvasListItem = ({ canvas }: CanvasListItemProps) => {
  return (
    <li className="my-1">
      <Link 
        to={`/app/canvas/${canvas._id}`}
        className="block p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
      >
        {canvas.name}
      </Link>
    </li>
  );
};