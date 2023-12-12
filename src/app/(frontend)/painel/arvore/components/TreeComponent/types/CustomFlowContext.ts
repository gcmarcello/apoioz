import { Edge, Node } from "reactflow";

export interface CustomFlowContext {
  saveEdges: (edges: Edge[]) => void;
  saveNodes: (nodes: Node[]) => void;
  onExpand: (node: Node) => void;
}
