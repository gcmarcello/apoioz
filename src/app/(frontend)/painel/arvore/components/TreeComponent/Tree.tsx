import { useCallback, useEffect, useState } from "react";
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
} from "reactflow";

import CustomNode from "./CustomNode";
import useAnimatedNodes from "./lib/useAnimatedNodes";
import useExpandCollapse from "./lib/useExpandCollapse";

import "reactflow/dist/base.css";
import { ComboboxField } from "@/app/(frontend)/_shared/components/fields/Select";
import { useForm } from "react-hook-form";
import {
  readSupportersFromGroup,
  readSupportersInverseTree,
} from "@/app/api/panel/supporters/actions";
import { ButtonSpinner } from "@/app/(frontend)/_shared/components/Spinners";

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
    (changes) => (nds) => {
      console.log(changes);
      return applyNodeChanges(changes, nds);
    },
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const addNodes = (nodes: Node[]) => {
    setNodes((nds) => nds.concat(nodes));
  };

  const addEdges = (edges: Edge[]) => {
    setEdges((eds) => eds.concat(edges));
  };

  const onExpand = useCallback(
    (node) => {
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

  const nodeTypes = {
    custom: (node) => (
      <CustomNode
        {...node}
        onExpand={() => onExpand(node)}
        addNodes={addNodes}
        addEdges={addEdges}
      />
    ),
  };

  const form = useForm();

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
      <Panel position="top-left" className="bg-white pb-6 pr-6">
        <ComboboxField
          label="Encontre um apoiador"
          hform={form}
          name={"name"}
          fetcher={readSupportersFromGroup}
          onChange={(value) => {
            readSupportersInverseTree({
              where: {
                supporterId: value.id,
              },
            });
          }}
          displayValueKey={"user.name"}
        />
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
