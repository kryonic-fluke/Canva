import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";
import { useRequestAccess } from "../hooks/useRequestAccess";
import { Spinner } from "../components/Spinner"; 

export const JoinCanvasPage = () => {
  const { _id, inviteToken } = useParams();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { mutate: requestAccessApi, isPending } = useRequestAccess();

  const [uiState, setUiState] = useState("LOADING"); 
  const [statusMessage, setStatusMessage] = useState("Verifying invite...");

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    const redirectPath = `/join/${_id}/${inviteToken}`;

    if (!user) {
      localStorage.setItem("postLoginRedirect", redirectPath);
      setStatusMessage("You've been invited! Please log in to join.");
      setUiState("NEEDS_LOGIN");
    } 
    else {
      localStorage.removeItem("postLoginRedirect");
      setStatusMessage("You have been invited to join this canvas.");
      setUiState("READY_TO_REQUEST");
    }
  }, [user, isAuthLoading, _id, inviteToken]);

  const handleRequestAccess = () => {
    if (!_id || !inviteToken) return;
    requestAccessApi({ _id, inviteToken });
  };


  if (uiState === "LOADING") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800 text-white">
        <Spinner text="Verifying invite..." size="lg" variant="light" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-800 text-white">
      <div className="p-8 bg-gray-700 rounded-lg shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-4">{statusMessage}</h1>
        
        {uiState === "NEEDS_LOGIN" && (
          <Link
            to="/login"
            className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-500"
          >
            Login to Continue
          </Link>
        )}
        
        {uiState === "READY_TO_REQUEST" && (
          <button
            onClick={handleRequestAccess}
            disabled={isPending}
            className="px-6 py-2 bg-green-600 rounded hover:bg-green-500 disabled:bg-gray-500"
          >
            {isPending ? "Sending..." : "Request Access"}
          </button>
        )}
      </div>
    </div>
  );
};