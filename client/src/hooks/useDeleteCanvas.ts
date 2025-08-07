import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteCanvasApi } from "../api/canvas";
import type { AxiosError } from "axios";




export const useDeleteCanvas = ()=>{

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (_id:string)=>deleteCanvasApi(_id) ,
         onSuccess:()=>{
               console.log('canvas deleted successfully');
                     queryClient.invalidateQueries({ queryKey: ['canvases'] });

        },
        onError:(error:AxiosError)=>{
            console.log('Error in deleting canvas',error.message);
          
            
        }
    })
}

