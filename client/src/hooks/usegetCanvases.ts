import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getCanvasesApi } from "../api/canvas";

export const useGetCanvases = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["canvases", user?.uid],
    queryFn: getCanvasesApi,
    enabled: !!user?.uid,
  });
};