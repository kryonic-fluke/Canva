// src/hooks/useDeleteEdge.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteEdge as deleteEdgeApi } from "../api/canvas"; // Make sure path is correct

interface DeleteEdgeVariables {
  canvasId: string;
  edgeId: string;
}

export const useDeleteEdge = () => {
  return useMutation<void, Error, DeleteEdgeVariables>({
    mutationFn: (variables) => deleteEdgeApi(variables.canvasId, variables.edgeId),

    onMutate: () => {
      toast.loading("Deleting connection...", { id: "delete-toast" });
    },
    onSuccess: () => {
      toast.success("Connection deleted!", { id: "delete-toast" });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete connection.", { id: "delete-toast" });
      console.error("Failed to delete edge:", error);
    },
  });
};