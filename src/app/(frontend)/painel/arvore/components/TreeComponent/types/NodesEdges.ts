import { Node } from "reactflow";

export type NodeData = {
  expanded: boolean;
  expandable: boolean;
  label: string;
  level: number;
  hasChildren: boolean;
};

export type ExpandCollapseNode = Node<NodeData>;
