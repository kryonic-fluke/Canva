
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming you have this hook

import { useRequestAccess } from '../hooks/useRequestAccess'; 

export const JoinCanvasPage = () => {
  const { _id, inviteToken } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();

  const { mutate: requestAccessApi, isPending } = useRequestAccess();

  const [statusMessage, setStatusMessage] = useState("Processing your invitation...");

  useEffect(() => {
  
    if (isAuthLoading) {
      return; 
    }


    if (!user) {
      localStorage.setItem('postLoginRedirect', `/join/${_id}/${inviteToken}`);
      navigate('/'); 
      return;
    }


    setStatusMessage("You have been invited to a canvas!");

  }, [user, isAuthLoading, _id, inviteToken, navigate]);

  const handleRequestAccess = () => {
    if (!_id || !inviteToken) return;
    
    requestAccessApi({_id, inviteToken });
    
    console.log(`Requesting access for canvas: ${_id} with token: ${inviteToken}`);
    alert("Request sent! The owner has been notified.");
    navigate('/app');
  };

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-800 text-white">
      <div className="p-8 bg-gray-700 rounded-lg shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-4">{statusMessage}</h1>
        {user && (
          <button
            onClick={handleRequestAccess}
            className="px-6 py-2 bg-green-600 rounded hover:bg-green-500 disabled:bg-gray-500"
          >
            {isPending ? 'Sending...' : 'Request Access'}
           
          </button>
        )}
      </div>
    </div>
  );
};