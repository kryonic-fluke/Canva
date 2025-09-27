import { useMemo } from 'react';
import { useReactFlow, type Node } from 'reactflow';
import  {ChecklistItem} from "../components/CheckListNode"



export type ChecklistDetail = {
  id: string;
  title: string;
  total: number;
  completed: number;
  percentage: number;
};

export type CanvasStats = {
  nodeCountsByType: { [key: string]: number };
  nodeCountsByCategory: { [key: string]: number };
  checklistProgress: {
    totalTasks: number;
    completedTasks: number;
    incompleteTasks: number;
    completionPercentage: number;
    details: ChecklistDetail[]; 
  };
};

type ProgressAccumulator = {
  total: number;
  completed: number;
  details: ChecklistDetail[];
};


// export const mockCanvasStats: CanvasStats = {
//   nodeCountsByType: {
//     "checklist": 4,
//     "note": 6,
//     "task": 8,
//     "flowchart": 3,
//     "diagram": 2,
//     "textNode": 5
//   },
//   nodeCountsByCategory: {
//     "Development": 8,
//     "Design": 6,
//     "Testing": 4,
//     "Documentation": 5,
//     "Planning": 3,
//     "Uncategorized": 2
//   },
//   checklistProgress: {
//     totalTasks: 45,
//     completedTasks: 28,
//     incompleteTasks: 17,
//     completionPercentage: 62,
//     details: [
//       {
//         id: "checklist-1",
//         title: "Frontend Development",
//         total: 12,
//         completed: 8,
//         percentage: 67
//       },
//       {
//         id: "checklist-2", 
//         title: "Backend API Setup",
//         total: 15,
//         completed: 12,
//         percentage: 80
//       },
//       {
//         id: "checklist-3",
//         title: "Database Configuration",
//         total: 8,
//         completed: 5,
//         percentage: 63
//       },
//       {
//         id: "checklist-4",
//         title: "Testing & Quality Assurance",
//         total: 10,
//         completed: 3,
//         percentage: 30
//       }
//     ]
//   }
// };
//demo data not for use now, kept for future testing 
export const useCanvasStats = (): CanvasStats | undefined=> {
  const { getNodes } = useReactFlow();


  const nodes = getNodes();
  // const edges = getEdges();

 const stats=useMemo(() => {
    const nodeCountsByType = nodes.reduce((acc: { [key: string]: number }, node: Node) => {
      const type = node.type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});


    //calculating the count of each node present
    const nodeCountsByCategory = nodes.reduce((acc: { [key: string]: number }, node: Node) => {
      const category = node.data?.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});


    //counting each categories 

    const checklistNodes = nodes.filter(node => node.type === 'checklist');
    //getting all the checklist nodes 
    const initialProgressData: ProgressAccumulator = {
      total: 0,
      completed: 0,
      details: [],
    };
    
    const progressData = checklistNodes.reduce((accumulator, node) => {
        const items = node.data.items || [];
        //get the list of tasks
        const totalInNode = items.length;
        //num of taks
        const completedInNode = items.filter((item:ChecklistItem)=> item.completed).length;
        //get number of   completed tasks in a checklist node
        const percentageInNode = totalInNode > 0 ? Math.round((completedInNode / totalInNode) * 100) : 0;
        //calculate the net percentage of tasks completed 
        accumulator.total += totalInNode;
        //add to globals tasks count of entire canvas
        accumulator.completed += completedInNode;
        
        accumulator.details.push({
            id: node.id,
            title: node.data.title || 'Untitled Checklist',
            total: totalInNode,
            completed: completedInNode,
            percentage: percentageInNode,
        });

        //assigining individual checklist their details

        return accumulator;

    }, initialProgressData); 

    const overallPercentage = progressData.total > 0 
        ? Math.round((progressData.completed / progressData.total) * 100) 
        : 0;

    const checklistProgress = {
        totalTasks: progressData.total,
        completedTasks: progressData.completed,
        incompleteTasks: progressData.total - progressData.completed,
        completionPercentage: overallPercentage,
        details: progressData.details,
    };

    //assigining the net cheklists data
    return   {
      nodeCountsByType,
      nodeCountsByCategory,
      checklistProgress,
    };
    
  }, [nodes]); 

   return stats; 
};