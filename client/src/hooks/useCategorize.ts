// src/hooks/useCategorize.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { categorizeNodeAPI } from "../services/huggingFace";
import { updateNodes } from "../api/canvas"; 
import type { Node } from "reactflow";
import toast from "react-hot-toast";

export const useCategorizeNodes = () => {
    const queryClient = useQueryClient();
    const { _id: canvasId } = useParams<{ _id: string }>();
  
    return useMutation({
        mutationFn: (nodesToCategorize: Node[]) => categorizeNodeAPI(nodesToCategorize),
        
        onSuccess: async (categorizationResults) => {
            if (!canvasId || !categorizationResults || categorizationResults.length === 0) return;

            console.log("Nodes categorized successfully, now saving to DB:🤗🤗==>", categorizationResults);
            toast.success("Nodes categorized successfully");

            const updatePromises = categorizationResults.map(result => 
              { const updatePayload = { 'data.category': result.category };
              return updateNodes(canvasId, result.nodeId, updatePayload as any);
         } );

            await Promise.all(updatePromises);
            
            queryClient.invalidateQueries({ queryKey: ['canvasNodes', canvasId] });
        },

        onError: (error) => {
                        toast.error("Failed to Catagorize Nodes");
            

            console.error("An error occurred during categorization:", error);
        }
    });
};