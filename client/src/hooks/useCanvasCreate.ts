import {  useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios";
import { createCanvasRequestAPI } from "../api/canvas";




 export const useCanvasCreate = ()=>{

    const queryClient  = useQueryClient();

    return useMutation({
        mutationFn:(newCanvasName:string)=>createCanvasRequestAPI({
            name:newCanvasName
        }),

        onSuccess:()=>{
               console.log('CreateCanvas mutation was successful. Invalidating canvases query...');
                     queryClient.invalidateQueries({ queryKey: ['canvases'] });

        },

        onError:(error:AxiosError)=>{
            console.error("Error in useCreateCanvas mutation:", error.message);
        }

    })

}