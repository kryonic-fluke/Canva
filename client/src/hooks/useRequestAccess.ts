import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { requestAccessApi } from "../api/canvas";




export const useRequestAccess = ()=>{

    const navigate = useNavigate();
    return useMutation({

        mutationFn:(data:{_id:string,inviteToken :string})=>{
            requestAccessApi(data)
        },
          onSuccess: () => {
      alert("Request sent successfully! The owner has been notified.");
      navigate('/app');
    },
     onError: (error) => {
      console.error("Failed to request access:", error);
      const errorMessage = error.response?.data?.message || "An unknown error occurred.";
      alert(`Could not send request: ${errorMessage}`);
    },


    })
}