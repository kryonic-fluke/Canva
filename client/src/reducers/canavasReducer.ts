import {
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
} from "reactflow";

export interface CanvasState {
  name: string;
  nodes: Node[];
  edges: Edge[];
  // We can add viewport, theme, etc. here later
}

export type CanvasAction = | { type: "SET_CANVAS"; payload: CanvasState }
  | { type: "ON_NODES_CHANGE"; payload: NodeChange[] }
  | { type: "ON_EDGES_CHANGE"; payload: EdgeChange[] }
  | { type: "ADD_NODE"; payload: Node };

export const canvasReducer = (
  state: CanvasState,
  action: CanvasAction
): CanvasState => {
  switch (action.type) {
    case "SET_CANVAS":
      return {
        ...state,
        ...action.payload,
      };

    case "ON_NODES_CHANGE":
      return {
        ...state,
        nodes: applyNodeChanges(action.payload, state.nodes),
      };

    case "ON_EDGES_CHANGE":
      return {
        ...state,
        edges: applyEdgeChanges(action.payload, state.edges),
      };

    case "ADD_NODE":
      return {
        ...state,
        nodes: [...state.nodes, action.payload],
      };

    default:
      return state;
  }
};
