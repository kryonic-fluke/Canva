
import { CanvasStats } from "../hooks/useCanvasStats";
import { SnapshotView } from "./Snapshotview";


interface SidebarProps{
  stats:CanvasStats;
  onAnalyzeClick:() => void;
  setIsSidebarOpen:(value:boolean)=>void;
}
export const SideBarView = ({ stats,setIsSidebarOpen }:SidebarProps) => {
  return (

      <div className="flex-grow overflow-y-auto">
        <SnapshotView stats={stats}  setIsSidebarOpen={setIsSidebarOpen}/>
      </div>
 
  );
};