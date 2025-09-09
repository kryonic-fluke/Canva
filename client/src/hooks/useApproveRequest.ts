import { useMutation, useQueryClient } from "@tanstack/react-query"
import {approveRequestApi} from "../api/canvas"
import { toast } from "react-hot-toast";

interface ApproveRequestVariables {
canvasId: string;
  userIdToApprove: string;
}

export const useApproveRequest=()=>{
const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(variables:ApproveRequestVariables)=>approveRequestApi(variables),
onSuccess: ( variables) => {
      toast.success("Request approved!", { id: "approve-request" });

      queryClient.invalidateQueries({ queryKey: ['canvases',variables.canvasId] });
       queryClient.invalidateQueries({ queryKey: ['canvases'] });
}
,
 onError: (error) => {
   toast.error(error.message || "Failed to approve request.", { id: "approve-request" });
      console.error("Failed to approve request:", error);
    },

    })
}