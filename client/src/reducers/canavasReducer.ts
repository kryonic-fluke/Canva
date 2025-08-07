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

export type CanvasAction =
  | { type: "SET_CANVAS"; payload: CanvasState }
  | { type: "ON_NODES_CHANGE"; payload: NodeChange[] }
  | { type: "ON_EDGES_CHANGE"; payload: EdgeChange[] }
  | { type: "ADD_NODE"; payload: Node }
  | { type: "REMOVE_NODE"; payload: string } // Fixed: should be node ID (string)
  | { type: "DELETE_NODES"; payload: Node[] }
  | { type: "ADD_MULTIPLE_NODES"; payload: Node[] }; // Added missing action

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

    case "REMOVE_NODE":
      return {
        ...state,
        nodes: state.nodes.filter(node => node.id !== action.payload),
      };

    case "DELETE_NODES": {
      const deletedNodeIds = new Set(action.payload.map((node: Node) => node.id));
      return {
        ...state,
        nodes: state.nodes.filter(node => !deletedNodeIds.has(node.id)),
      };
    }

    case "ADD_MULTIPLE_NODES":
      return {
        ...state,
        nodes: [...state.nodes, ...action.payload],
      };

    default:
      return state;
  }
};