
import { useState, useEffect } from 'react';
import { listenForPendingRequests,type PendingRequest } from '../api/canvas'; // Import our new separated function

export const usePendingRequests = (_id: string | undefined) => {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!_id) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = listenForPendingRequests(_id, (newRequests) => {
      setRequests(newRequests);
      setIsLoading(false);
    });

    return () => {
      console.log("Cleaning up pending requests listener for canvas:", _id);
      unsubscribe();
    };
    
  }, [_id]); 

  return { requests, data: requests, isLoading };
};