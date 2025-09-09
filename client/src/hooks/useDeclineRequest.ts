import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast'; 
import { declineRequest } from '../api/canvas';

interface DeclineRequestVariables {
  canvasId: string;
  userIdToDecline: string;
}

export const useDeclineRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: DeclineRequestVariables) => declineRequest(variables),

    onMutate: async () => {
      toast.loading('Declining request...', { id: 'decline-request' });
    },

    onSuccess: ( variables) => {
      toast.success('Request declined successfully.', { id: 'decline-request' });
      
      queryClient.invalidateQueries({ queryKey: ['pendingRequests', variables.canvasId] });
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to decline the request.', { id: 'decline-request' });
      console.error("Failed to decline request:", error);
    },
  });
};