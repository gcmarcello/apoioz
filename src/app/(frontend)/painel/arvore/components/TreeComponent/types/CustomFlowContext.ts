import { Edge, Node } from "reactflow";

export interface CustomFlowContext {
  saveEdges: (edges: Edge[]) => void;
  saveNodes: (nodes: Node[]) => void;
  toggleNodesVisibility: (node: Node) => void;
}
