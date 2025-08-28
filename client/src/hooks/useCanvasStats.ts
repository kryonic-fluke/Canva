import { useMemo } from 'react'; 
import { useReactFlow, type Node } from 'reactflow';

export interface CanvasStats {
  nodeCountsByType: { [key: string]: number };
  nodeCountsByCategory: { [key: string]: number };
}

export const useCanvasStats = (): CanvasStats => {
  const { getNodes, getEdges } = useReactFlow();

  const stats = useMemo(() => {
    const rawNodes = getNodes();
    const rawEdges = getEdges(); 

    
    const nodeCountsByType = rawNodes.reduce((accumulator: { [key: string]: number }, currentNode: Node) => {
      const type = currentNode.type;
      if (type) {
        if (accumulator[type]) {
          accumulator[type] += 1;
        } else {
          accumulator[type] = 1;
        }
      }
      return accumulator;
    }, {}); 

    const nodeCountsByCategory = rawNodes.reduce((accumulator: { [key: string]: number }, currentNode: Node) => {
      const category = currentNode.data.category;

      if (category) {
        if (accumulator[category]) {
          accumulator[category] += 1;
        } else {
          accumulator[category] = 1;
        }
      } else {
        const uncategorizedKey = 'Uncategorized';
        if (accumulator[uncategorizedKey]) {
          accumulator[uncategorizedKey] += 1;
        } else {
          accumulator[uncategorizedKey] = 1;
        }
      }
      return accumulator;
    }, {});

    return {
      nodeCountsByType,
      nodeCountsByCategory,
    };
    
  }, [getNodes, getEdges]);

  return stats;
};