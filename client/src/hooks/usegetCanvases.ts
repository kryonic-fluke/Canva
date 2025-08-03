import { useQuery } from "@tanstack/react-query"
import { getCanvasesApi } from "../api/canvas"



export const  useGetCanvases = ()=>{
    return useQuery({
        queryKey:['canvases'],
        queryFn:getCanvasesApi
    })
}