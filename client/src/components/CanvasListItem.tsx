
import { Link } from 'react-router-dom';
import { useDeleteCanvas } from '../hooks/useDeleteCanvas';
import { useGetInviteLink } from '../hooks/usegetInviteLink';
import { Menu } from '@headlessui/react';
import { useAuth } from '../context/AuthContext';
import { useApproveRequest } from '../hooks/useApproveRequest';
import { useDeclineRequest } from '../hooks/useDeclineRequest';
import { usePendingRequests } from '../hooks/usePendingRequest';

interface CanvasListItemProps {
  canvas: {
    _id: string;
    name: string;
    owner: {
      _id: string;
      firebaseUid: string;
    };
  };
}


export const CanvasListItem = ({ canvas }: CanvasListItemProps) => {
  
    const { user } = useAuth();

const { _id: canvasId, name, owner } = canvas;

    const { mutate: deleteCanvas, isPending: isDeleting } = useDeleteCanvas();
const { mutate: getInviteLink, isPending: isGettingLink } = useGetInviteLink();
const { data: requests, isLoading: isLoadingRequests } = usePendingRequests(canvasId);
const { mutate: approveRequest } = useApproveRequest();
const { mutate: declineRequest } = useDeclineRequest();
const handleDelete = () => { deleteCanvas(canvasId); };
const handleShare = () => { getInviteLink(canvasId); };


 const isOwner = user?.uid === owner?.firebaseUid;
const handleApprove = (userIdToApprove: string) => {
    approveRequest({ canvasId, userIdToApprove });
  };
  
  const handleDecline = (userIdToDecline: string) => {
    declineRequest({ canvasId, userIdToDecline });
  };
 return (
  <li className="my-2 p-3 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700/50 transition-colors duration-200">
    <div className="flex justify-between items-center space-x-2">

      <Link to={`/app/canvas/${canvasId}`} className="text-white hover:text-blue-400 font-semibold flex-grow truncate">
        {name}
      </Link>

      {isOwner && (
        <div className="relative flex-shrink-0">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button 
                className={`flex items-center rounded-md p-1.5 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75
                  ${requests && requests.length > 0 ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                {isLoadingRequests ? (
                  <div className="w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                )}
                {requests && requests.length > 0 && !isLoadingRequests && (
                  <span className="ml-1 font-bold text-yellow-400">({requests.length})</span>
                )}
              </Menu.Button>
            </div>

            <Menu.Items className="absolute right-0 mt-2 w-72 origin-top-right bg-gray-900 border border-gray-700 rounded-md shadow-lg focus:outline-none z-50">
              
              <div className="p-1">
                <div className="px-3 pt-2 pb-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Requests</div>
                {requests && requests.length > 0 ? (
                  requests.map((req) => (
                    <Menu.Item key={req.id}>
                      {({ active }) => (
                        <div className={`${active ? 'bg-blue-600' : ''} text-white group flex rounded-md items-center justify-between w-full px-3 py-2 text-sm`}>
                          <div className="flex flex-col text-left">
                            <span className="font-semibold text-gray-100">{req.userName}</span>
                            <span className={`${active ? 'text-blue-200' : 'text-gray-400'} text-xs`}>{req.userEmail}</span>
                          </div>
                          <div className="space-x-2 flex-shrink-0">
                            <button
                              onClick={() => handleApprove(req.id)}
                              className="px-3 py-1.5 text-xs font-semibold bg-green-600 text-white rounded hover:bg-green-500 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDecline(req.id)}
                              className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded hover:bg-red-500 transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">No pending requests.</div>
                )}
              </div>

              <div className="border-t border-gray-700/50 mx-2 my-1"></div>

              <div className="p-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleShare}
                      disabled={isGettingLink}
                      className={`${active ? 'bg-gray-700 text-white' : 'text-gray-200'} group flex w-full items-center rounded-md px-3 py-2 text-sm disabled:opacity-50 text-left`}
                    >
                      Share Invite Link
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className={`${active ? 'bg-red-600 text-white' : 'text-red-500'} group flex w-full items-center rounded-md px-3 py-2 text-sm disabled:opacity-50 text-left font-medium`}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Canvas'}
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </div>
      )}
    </div>
  </li>
);
};