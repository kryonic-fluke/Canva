import { useMemo } from 'react';
import { useReactFlow, type Node } from 'reactflow';



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


export const useCanvasStats = (): CanvasStats => {
  const { getNodes, getEdges } = useReactFlow();


  const nodes = getNodes();
  const edges = getEdges();

  const stats = useMemo(() => {
    const nodeCountsByType = nodes.reduce((acc: { [key: string]: number }, node: Node) => {
      const type = node.type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const nodeCountsByCategory = nodes.reduce((acc: { [key: string]: number }, node: Node) => {
      const category = node.data?.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const checklistNodes = nodes.filter(node => node.type === 'checklist');
    
    const initialProgressData: ProgressAccumulator = {
      total: 0,
      completed: 0,
      details: [],
    };
    
    const progressData = checklistNodes.reduce((accumulator, node) => {
        const items = node.data.items || [];
        const totalInNode = items.length;
        const completedInNode = items.filter(item => item.completed).length;
        const percentageInNode = totalInNode > 0 ? Math.round((completedInNode / totalInNode) * 100) : 0;

        accumulator.total += totalInNode;
        accumulator.completed += completedInNode;
        
        accumulator.details.push({
            id: node.id,
            title: node.data.title || 'Untitled Checklist',
            total: totalInNode,
            completed: completedInNode,
            percentage: percentageInNode,
        });

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

    return {
      nodeCountsByType,
      nodeCountsByCategory,
      checklistProgress,
    };
    
  }, [nodes,]); 

  return stats;
};