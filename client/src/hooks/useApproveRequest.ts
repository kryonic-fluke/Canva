import { useMutation, useQueryClient } from "@tanstack/react-query"
import {approveRequestApi} from "../api/canvas"


interface ApproveRequestVariables {
canvasId: string;
  userIdToApprove: string;
}

export const useApproveRequest=()=>{
const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(variables:ApproveRequestVariables)=>approveRequestApi(variables),
onSuccess: (data, variables) => {
      console.log("Approval successful:", data.message);

      queryClient.invalidateQueries({ queryKey: ['canvases',variables.canvasId] });
       queryClient.invalidateQueries({ queryKey: ['canvases'] });
}
,
 onError: (error) => {
      console.error("Failed to approve request:", error);
      alert("An error occurred while approving the request.");
    },

    })
}