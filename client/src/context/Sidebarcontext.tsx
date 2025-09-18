
import {  createContext,  useContext,  useState,  ReactNode,  Dispatch,  SetStateAction,  useEffect} from "react";
import { useGetCanvases } from "../hooks/usegetCanvases";


interface SidebarContextType {
  selectedCanvasId: string;
  setSelectedCanvasId: Dispatch<SetStateAction<string>>;
  isCanvasesLoading: boolean; 
}


const SidebarContext = createContext<SidebarContextType | undefined>(undefined);


export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const { data: canvases, isLoading: isCanvasesLoading } = useGetCanvases();
  const [selectedCanvasId, setSelectedCanvasId] = useState("");

  useEffect(() => {
    if (canvases && canvases.length > 0 && !selectedCanvasId) {
      setSelectedCanvasId(canvases[0]._id);
    }
  }, [canvases,selectedCanvasId]); 

  const value = { selectedCanvasId, setSelectedCanvasId, isCanvasesLoading };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};


export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }

  return context;
};