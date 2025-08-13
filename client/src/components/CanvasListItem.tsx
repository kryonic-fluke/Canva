// src/components/CanvasListItem.tsx

import { Link } from 'react-router-dom';
import { useDeleteCanvas } from '../hooks/useDeleteCanvas';
import { useGetInviteLink } from '../hooks/usegetInviteLink';
import { Menu } from '@headlessui/react';
import { useAuth } from '../context/AuthContext';
import { useApproveRequest } from '../hooks/useApproveRequest';
import { useDeclineRequest } from '../hooks/useDeclineRequest';
import { usePendingRequests } from '../hooks/usePendingRequest';

// Updated prop type
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

// src/components/CanvasListItem.tsx

export const CanvasListItem = ({ canvas }: CanvasListItemProps) => {
    // ... all your hook and handler logic ...
    // No changes needed to that part. It is correct.
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
      <div className="flex justify-between items-center">
        <Link to={`/app/canvas/${canvasId}`} className="text-white hover:text-blue-400 font-semibold flex-grow mr-2 truncate">
          {name}
        </Link>

        <div className="flex items-center space-x-2 flex-shrink-0">
          
          {isOwner && (
            <div className="relative">
              <Menu>
                <Menu.Button
                  className={`px-3 py-1 text-xs font-bold text-white rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition-all duration-200
                    ${requests && requests.length > 0
                      ? 'bg-yellow-500 hover:bg-yellow-400 animate-pulse'
                      : 'bg-gray-600'
                    }`}
                  disabled={!requests || requests.length === 0}
                >
                  {isLoadingRequests ? '...' : `Requests (${requests?.length || 0})`}
                </Menu.Button>

                <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="px-1 py-1 ">
                    {requests && requests.length > 0 ? (
                      requests.map((req) => (
                        <Menu.Item key={req.id}>
                          {({ active }) => (
                            <div className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'} group flex rounded-md items-center justify-between w-full px-2 py-2 text-sm`}>
                              {/* User Info */}
                              <div className="flex flex-col">
                                <span className="font-semibold">{req.userName}</span>
                                <span className={`${active ? 'text-blue-200' : 'text-gray-500'} text-xs`}>{req.userEmail}</span>
                              </div>
                              {/* Action Buttons */}
                              <div className="space-x-1 flex-shrink-0">
                                <button
                                  onClick={() => handleApprove(req.id)}
                                  className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-500"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleDecline(req.id)}
                                  className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-500"
                                >
                                  Decline
                                </button>
                              </div>
                            </div>
                          )}
                        </Menu.Item>
                      ))
                    ) : (
                      <div className="px-2 py-2 text-sm text-gray-500">No pending requests.</div>
                    )}
                  </div>
                </Menu.Items>
              </Menu>
            </div>
          )}

        

          {isOwner && (
            <>
             <button onClick={handleShare} disabled={isGettingLink} className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-500 disabled:bg-gray-500">
            {isGettingLink ? '...' : 'Share'}
          </button>
            
            <button onClick={handleDelete} disabled={isDeleting} className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-500 disabled:bg-gray-500">
              {isDeleting ? '...' : 'Delete'}
            </button>
            </>
             
          )}
        </div>
      </div>
    </li>
  );
};