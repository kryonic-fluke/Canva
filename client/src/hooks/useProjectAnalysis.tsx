
import {  useQuery } from '@tanstack/react-query';

import { Analysis, ProjectAnalysis } from '../api/Analysis';


export const useProjectAnalysis = (stats: CanvasStats) => {


    return useQuery<ProjectAnalysis, Error>({
queryKey: ['projectAnalysis', stats], 

queryFn: () => Analysis(stats),

 enabled: false, 
 //this will ensure , fetch happens only when asked for 
 refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes


    })
};