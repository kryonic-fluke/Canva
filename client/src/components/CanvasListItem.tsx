import { Link } from "react-router-dom";
import { useDeleteCanvas } from "../hooks/useDeleteCanvas";
import { useGetInviteLink } from "../hooks/usegetInviteLink";
import { Menu } from "@headlessui/react";
import { useAuth } from "../context/AuthContext";
import { useApproveRequest } from "../hooks/useApproveRequest";
import { useDeclineRequest } from "../hooks/useDeclineRequest";
import { usePendingRequests } from "../hooks/usePendingRequest";

interface CanvasListItemProps {
  canvas: {
    _id: string;
    name: string;
    owner: {
      _id: string;
      firebaseUid: string;
    };
  };

  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const CanvasListItem = ({
  canvas,
  onSelect,
  isSelected,
}: CanvasListItemProps) => {
  const { user } = useAuth();
  const { _id: canvasId, name, owner } = canvas;

  const { mutate: deleteCanvas, isPending: isDeleting } = useDeleteCanvas();
  const { mutate: getInviteLink, isPending: isGettingLink } =
    useGetInviteLink();
  const { data: requests, isLoading: isLoadingRequests } =
    usePendingRequests(canvasId);
  const { mutate: approveRequest, isPending: isApproving } =
    useApproveRequest();
  const { mutate: declineRequest, isPending: isDeclining } =
    useDeclineRequest();

  const handleDelete = () => {
    deleteCanvas(canvasId);
  };
  const handleShare = () => {
    getInviteLink(canvasId);
  };

  const isOwner = user?.uid === owner?.firebaseUid;

  const handleApprove = (userIdToApprove: string) => {
    approveRequest({ canvasId, userIdToApprove });
  };

  const handleDecline = (userIdToDecline: string) => {
    declineRequest({ canvasId, userIdToDecline });
  };

  const handleSelect = () => {
    onSelect(canvasId);
  };

  return (
    <li className="my-2 p-3 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700/50 transition-colors duration-200">
      <div className="flex justify-between items-center space-x-2">
        <Link
          to={`/app/canvas/${canvasId}`}
          onClick={handleSelect}
          className={`${
            isSelected ? "text-blue-400" : "text-white"
          } hover:text-blue-400 font-semibold flex-grow truncate`}
        >
          {" "}
          {name}
        </Link>

        {isOwner && (
          <div className="relative flex-shrink-0">
            <Menu as="div" className="relative text-left">
              <div>
                <Menu.Button
                  className={`flex items-center rounded-md p-1.5 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75
                  ${
                    requests && requests.length > 0
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  {isLoadingRequests ? (
                    <div className="w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
                  ) : (
                    <svg
                      xmlns="http://www.w.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  )}
                  {requests && requests.length > 0 && !isLoadingRequests && (
                    <span className="ml-1 font-bold text-yellow-400">
                      ({requests.length})
                    </span>
                  )}
                </Menu.Button>
              </div>

              <Menu.Items className="fixed left-[12rem]  mt-2 origin-top-right bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 focus:outline-none">
                <div className="px-3 py-2 overflow-y-auto">
                  <div className="px-3 pt-2 pb-1 text-xs font-bold text-gray-400 uppercase w">
                    Pending Requests
                  </div>
                  {requests && requests.length > 0 ? (
                    requests.map((req) => (
                      <Menu.Item key={req.id}>
                        {({ active }) => (
                          <div
                            className={`${
                              active ? "bg-gray-800" : ""
                            } text-white group flex rounded-md items-center justify-between w-full px-3 py-2 text-sm gap-4 max-h-60 `}
                          >
                            <div className="flex flex-col text-left">
                              <span className="font-semibold text-gray-100">
                                {req.userName}
                              </span>
                              <span
                                className={`${
                                  active ? "text-blue-200" : "text-gray-400"
                                } text-xs`}
                              >
                                {req.userEmail}
                              </span>
                            </div>
                            <div className="space-x-2 flex-shrink-0  ">
                              <button
                                onClick={() => handleApprove(req.id)}
                                disabled={isApproving || isDeclining}
                                className="px-3 py-1.5 text-xs font-semibold bg-green-600 text-white rounded hover:bg-green-500 transition-colors disabled:opacity-50 "
                              >
                                {isApproving ? "..." : "Approve"}
                              </button>
                              <button
                                onClick={() => handleDecline(req.id)}
                                disabled={isApproving || isDeclining}
                                className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded hover:bg-red-500 transition-colors disabled:opacity-50"
                              >
                                {isDeclining ? "..." : "Decline"}
                              </button>
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      No pending requests.
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-700  mx-2 my-1"></div>

                <div className="p-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleShare}
                        disabled={isGettingLink}
                        className={`${
                          active ? " text-blue-500" : "text-gray-200 "
                        } text-center group flex w-full justify-center gap-[2rem] items-center rounded-md px-3 py-2 text-md font-medium disabled:opacity-50  transition-all duration-900 ease-in-out`}
                      >
                        <p>Share</p>

                        <img src="/img/share3.png" className="h-[1.2rem]" />
                      </button>
                    )}
                  </Menu.Item>
                                  <div className="border-t border-gray-700  mx-2 my-1"></div>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className={`${
                          active ? " text-red-600" : "text-white-500"
                        }  group flex justify-center w-full items-center gap-3 rounded-md px-3 py-2 text-md disabled:opacity-50 text-left font-medium transition-colors duration-400 ease-in-out`}
                      >
                        <p>{isDeleting ? "Deleting..." : "Delete Canvas"}</p>
                        {/* <IoShareOutline/> */}
                        <img src="/img/trash-bin.png" className="h-[1.2rem]" />
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
