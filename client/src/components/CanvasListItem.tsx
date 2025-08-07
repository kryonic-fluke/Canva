import { Link } from 'react-router-dom';
import { useDeleteCanvas } from '../hooks/useDeleteCanvas';
import { useGetInviteLink } from '../hooks/usegetInviteLink';

interface CanvasListItemProps {
  canvas: {
    _id: string;
    name:string;
  };
}

export const CanvasListItem = ({ canvas }: CanvasListItemProps) => {

const {mutate:deleteCanvas , isPending } = useDeleteCanvas();
 const { mutate: getInviteLink, isPending: isGettingLink } = useGetInviteLink();
  const handleDelete=()=>{
    if(!canvas._id) return ;
    console.log("canvas",canvas);
    
    deleteCanvas(canvas._id);

  }

  const handleShare = () => {
    if (!canvas._id) return;
    getInviteLink(canvas._id);
  };
  return (
    <>
     <li className="my-1">
      <Link 
        to={`/app/canvas/${canvas._id}`}
        className="block p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
      >
        {canvas.name}
      </Link>
       <button 
          onClick={handleShare}
          disabled={isGettingLink}
          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-500 disabled:bg-gray-500"
        >
          {isGettingLink ? '...' : 'Share'}
        </button>
    </li>
    <button onClick={handleDelete}>
        Delete 
    </button>
    </>
   
  );
};