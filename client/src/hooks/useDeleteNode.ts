import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteNode as deleteNodeApi } from "../api/canvas"; 

interface DeleteNodeVariables {
  canvasId: string;
  nodeId: string;
}

export const useDeleteNode = () => {
  return useMutation<void, Error, DeleteNodeVariables>({
    mutationFn: (variables) =>
      deleteNodeApi(variables.canvasId, variables.nodeId),

    onMutate: () => {
      toast.loading("Deleting node...", { id: "delete-toast" });
    },

    onSuccess: () => {
      toast.success("Node deleted!", { id: "delete-toast" });
    },

    onError: (error) => {
      toast.error(error.message || "Failed to delete node.", {
        id: "delete-toast",
      });
      console.error("Failed to delete node:", error);
    },
  });
};
