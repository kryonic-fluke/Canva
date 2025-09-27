import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteCanvasApi } from "../api/canvas";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";




export const useDeleteCanvas = ()=>{

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (_id:string)=>deleteCanvasApi(_id) ,
         onSuccess:()=>{
            toast.success('Canvas deleted successfully');
            //    console.log('canvas deleted successfully');
                     queryClient.invalidateQueries({ queryKey: ['canvases'] });

        },
        onError:(error:AxiosError)=>{
            toast.error('Error in deleting canvas');
            console.log('Error in deleting canvas',error.message);
          
            
        }
    })
}

