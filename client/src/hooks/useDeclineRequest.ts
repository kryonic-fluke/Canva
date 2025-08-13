import { useMutation, useQueryClient } from "@tanstack/react-query";
import { declineRequest } from "../api/canvas";



interface DeclineRequestVariables {
  canvasId: string;
  userIdToDecline: string;
}
export const useDeclineRequest = ()=>{
  const queryClient = useQueryClient();

    
return useMutation({
    mutationFn: (variables:DeclineRequestVariables)=>declineRequest(variables),

     onSuccess: (data, variables) => {
      console.log("Decline successful:", data.message);
      
      queryClient.invalidateQueries({ queryKey: ['pendingRequests', variables.canvasId] });
      
      alert("Request declined.");
    },
onError: (error) => {
      console.error("Failed to decline request:", error);
      alert("An error occurred while declining the request.");
    },
    
})

}