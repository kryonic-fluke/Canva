import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { removeContributor } from "../api/canvas";

export const useRemoveContributor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { canvasId: string; userId: string }) =>
      removeContributor(params),
    onSuccess: () => {
      toast.success("Canvas leave successfull");
      queryClient.invalidateQueries({ queryKey: ["canvases"] }); 
    },

    onError: () => {
      toast.error("Failed to leave canvas");
    },
  });
};
