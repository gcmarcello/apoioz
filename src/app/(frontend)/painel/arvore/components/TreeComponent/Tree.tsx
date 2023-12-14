import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  applyEdgeChanges,
  applyNodeChanges,
  ReactFlowProvider,
  MiniMap,
  Background,
  OnNodesChange,
  OnEdgesChange,
  Node,
  Edge,
  Panel,
  useReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";

import { CustomNode } from "./components/CustomNode";
import useAnimatedNodes from "./lib/useAnimatedNodes";
import useExpandCollapse from "./lib/useExpandCollapse";

import "reactflow/dist/base.css";
import { useForm } from "react-hook-form";
import { NodeSearch } from "./components/NodeSearch";

const proOptions = { account: "paid-pro", hideAttribution: true };

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
  treeWidth = 550,
  treeHeight = 220,
  animationDuration = 300,
}: ExpandCollapseExampleProps) {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const { nodes: visibleNodes, edges: visibleEdges } = useExpandCollapse(nodes, edges, {
    treeWidth,
    treeHeight,
  });

  const { nodes: animatedNodes } = useAnimatedNodes(visibleNodes, {
    animationDuration,
  });

  const toggleNodesVisibility = useCallback(
    (toggledNodes: Node[] | Node) => {
      setNodes((nodes) => {
        const toggledNodesArray = Array.isArray(toggledNodes)
          ? toggledNodes
          : [toggledNodes];
        return nodes.map((n) => {
          if (toggledNodesArray.some((tn) => tn.id === n.id)) {
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

  const saveNodes = useCallback(
    (newNodes: Node[]) => {
      setNodes((currentNodes) => {
        const newUniqueNodes = newNodes.filter(
          (newNode) =>
            !currentNodes.some((existingNode) => existingNode.id === newNode.id)
        );
        const updatedCurrentNodes = currentNodes.map((n) => {
          const updatedNode = newNodes.find((nn) => nn.id === n.id);
          return updatedNode
            ? {
                ...n,
                data: updatedNode.data,
              }
            : n;
        });
        return updatedCurrentNodes.concat(newUniqueNodes);
      });
    },
    [setNodes]
  );

  const saveEdges = useCallback(
    (newEdges: Edge[]) => {
      setEdges((currentEdges) => {
        const newUniqueEdges = newEdges.filter(
          (newEdge) =>
            !currentEdges.some((existingEdge) => existingEdge.id === newEdge.id)
        );
        const updatedCurrentEdges = currentEdges.map((e) => {
          const updatedEdge = newEdges.find((ne) => ne.id === e.id);
          return updatedEdge
            ? {
                ...e,
                data: updatedEdge.data,
              }
            : e;
        });
        return updatedCurrentEdges.concat(newUniqueEdges);
      });
    },
    [setEdges]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const customFlowContext = useMemo(
    () => ({ toggleNodesVisibility, saveNodes, saveEdges }),
    [toggleNodesVisibility, saveNodes, saveEdges]
  );

  const nodeTypes = useMemo(
    () => ({
      custom: (node) => <CustomNode {...node} customFlowContext={customFlowContext} />,
    }),
    [customFlowContext]
  );

  return (
    <ReactFlow
      fitView
      nodes={animatedNodes}
      edges={visibleEdges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      proOptions={proOptions}
      nodeTypes={nodeTypes}
      nodesDraggable={false}
      nodesConnectable={false}
      zoomOnDoubleClick={false}
      elementsSelectable={false}
    >
      <Panel position="top-left" className="rounded-2xl bg-slate-50 bg-opacity-50 p-6">
        <NodeSearch customFlowContext={customFlowContext} />
      </Panel>
      <Background />
      <MiniMap />
    </ReactFlow>
  );
}

export default function Tree({ initialNodes, initialEdges }) {
  return (
    <ReactFlowProvider>
      <ReactFlowPro initialNodes={initialNodes} initialEdges={initialEdges} />
    </ReactFlowProvider>
  );
}
