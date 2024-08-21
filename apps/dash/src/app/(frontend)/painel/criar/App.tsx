"use client";
import { useCallback, MouseEvent } from "react";
import ReactFlow, {
  Background,
  Panel,
  ProOptions,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
  NodeOrigin,
  NodeMouseHandler,
  addEdge,
  OnConnect,
} from "reactflow";
import "reactflow/dist/style.css";

// This is used to display a leva (https://github.com/pmndrs/leva) control panel for the example
import { useControls } from "leva";

import useForceLayout from "./useForceLayout";

import styles from "./styles.module.css";

const proOptions: ProOptions = { account: "paid-pro", hideAttribution: true };

type ExampleProps = {
  strength?: number;
  distance?: number;
  supporters?: any[];
  initialNodes?: any[];
  initialEdges?: any[];
};

const nodeOrigin: NodeOrigin = [0.5, 0.5];

const defaultEdgeOptions = { style: { stroke: "#5046e5", strokeWidth: 3 } };

const emojis = ["👍", "👌", "👏", "👋", "🙌"];

const randomEmoji = (): string => {
  return emojis[Math.floor(Math.random() * (emojis.length - 1))] ?? "👍";
};

function ReactFlowPro({
  strength = -1000,
  distance = 150,
  initialNodes = [],
  initialEdges = [],
}: ExampleProps = {}) {
  const { screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useForceLayout({ strength, distance });

  const onPaneClick = useCallback(
    (evt: MouseEvent) => {
      const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });
      setNodes((nds) => [
        ...nds,
        {
          id: `${nds.length + 1}`,
          position,
          data: { label: randomEmoji() },
          className: styles.node,
        },
      ]);
    },
    [screenToFlowPosition, setNodes]
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      console.log(node);
      /* const childId = `${nodes.length + 1}`;
      const childNode = {
        id: childId,
        position: { x: node.position.x + 100, y: node.position.y + 100 },
        data: { label: randomEmoji() },
        className: styles.node,
      };
      const childEdge = {
        id: `${node.id}->${childId}`,
        source: node.id,
        target: childId,
      };

      setNodes((nds) => [...nds, childNode]);
      setEdges((eds) => [...eds, childEdge]); */
    },
    [nodes.length, setNodes, setEdges]
  );

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      proOptions={proOptions}
      onConnect={onConnect}
      onPaneClick={onPaneClick}
      nodeOrigin={nodeOrigin}
      onNodeClick={onNodeClick}
      defaultEdgeOptions={defaultEdgeOptions}
      defaultViewport={{
        x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
        y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
        zoom: 0,
      }}
    >
      <Panel position="top-left">
        <b>How to use:</b> Click anywhere on the panel to add nodes, click a
        node to add a connection
      </Panel>
      <Background />
    </ReactFlow>
  );
}

function ReactFlowWrapper({
  initialEdges,
  initialNodes,
}: {
  initialEdges: any;
  initialNodes: any;
}) {
  return (
    <ReactFlowProvider>
      <ReactFlowPro initialNodes={initialNodes} initialEdges={initialEdges} />
    </ReactFlowProvider>
  );
}

export default ReactFlowWrapper;
