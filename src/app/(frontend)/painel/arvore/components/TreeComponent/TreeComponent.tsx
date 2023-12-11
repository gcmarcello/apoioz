import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  applyEdgeChanges,
  applyNodeChanges,
  ReactFlowProvider,
  MiniMap,
  Background,
  OnNodesChange,
  OnEdgesChange,
  NodeMouseHandler,
  Node,
  Edge,
} from "reactflow";

import CustomNode from "./CustomNode";
import useAnimatedNodes from "./lib/useAnimatedNodes";
import useExpandCollapse from "./lib/useExpandCollapse";

import "reactflow/dist/base.css";
import styles from "./styles/styles.module.css";

const proOptions = { account: "paid-pro", hideAttribution: true };

const nodeTypes = {
  custom: CustomNode,
};

type ExpandCollapseExampleProps = {
  initialNodes: Node[];
  initialEdges: Edge[];
  treeWidth?: number;
  treeHeight?: number;
  animationDuration?: number;
};

function ReactFlowPro({
  initialNodes,
  initialEdges,
  treeWidth = 400,
  treeHeight = 125,
  animationDuration = 300,
}: ExpandCollapseExampleProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const { nodes: visibleNodes, edges: visibleEdges } = useExpandCollapse(nodes, edges, {
    treeWidth,
    treeHeight,
  });
  const { nodes: animatedNodes } = useAnimatedNodes(visibleNodes, {
    animationDuration,
  });

  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      setNodes((nds) => {
        console.log(changes);
        return applyNodeChanges(changes, nds);
      }),
    []
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      setNodes((nds) => {
        return nds.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              data: { ...n.data, expanded: !n.data.expanded },
            };
          }

          return n;
        });
      });
    },
    [setNodes]
  );

  return (
    <ReactFlow
      fitView
      nodes={animatedNodes}
      edges={visibleEdges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      proOptions={proOptions}
      nodeTypes={nodeTypes}
      nodesDraggable={false}
      nodesConnectable={false}
      className={styles.viewport}
      zoomOnDoubleClick={false}
      elementsSelectable={false}
    >
      <Background />
      <MiniMap />
    </ReactFlow>
  );
}

export default function TreeComponent({ initialNodes, initialEdges }) {
  return (
    <ReactFlowProvider>
      <ReactFlowPro initialNodes={initialNodes} initialEdges={initialEdges} />
    </ReactFlowProvider>
  );
}
