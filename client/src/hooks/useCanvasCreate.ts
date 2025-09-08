import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { createCanvasRequestAPI } from "../api/canvas";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export const useCanvasCreate = () => {
  const queryClient = useQueryClient();
const { user } = useAuth();
  return useMutation({
    mutationFn: (newCanvasName: string) =>
      createCanvasRequestAPI({
        name: newCanvasName,
      }),

    onSuccess: () => {
       toast.success("Canvas created!");
      queryClient.invalidateQueries({ queryKey: ["canvases", user?.uid] });
    },
    onError: (error: AxiosError) => {
      console.error("Error in useCreateCanvas mutation:", error.message);
    },
  });
};
