import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { requestAccessApi } from "../api/canvas";
import { isAxiosError,  } from "axios";
import toast from "react-hot-toast";

export const useRequestAccess = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: { _id: string; inviteToken: string }) => {
      return requestAccessApi(data);
    },
    onSuccess: () => {
      toast.success("Request sent!");
      navigate("/app");
    },
    onError: (error) => {
      let errorMessage = "An unknown error occurred.";
      let requestUrl = "URL not available";

      if (isAxiosError(error)) {
        if (error.config) {
          requestUrl = error.config.url || "URL not available";
        }

        if (error.response?.data?.message) {
          errorMessage = error.response.data.message as string;
           console.error(`API call to ${requestUrl} failed with error:`, errorMessage);
        } 
        
        
        else if (error.message) {
          errorMessage = error.message;
        }
      }

          toast.error("Failed to ask for access.");
    },
  });
};
