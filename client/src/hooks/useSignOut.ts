import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { firebaseSignOut } from "../services/firebase";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: signOut, isPending: isLoggingOut } = useMutation({
    mutationFn: firebaseSignOut,
    onSuccess: () => {
      queryClient.clear(); 
      navigate("/");
    },
    onError: (error) => {
      console.error(error.message);
    }
  });

  return { signOut, isLoggingOut };
}