import React from "react";
import ReactFlow, { Controls, MiniMap } from "reactflow";
import dagre from "@dagrejs/dagre";
import "reactflow/dist/base.css";
import SupporterNode from "../SupporterNode";

const TreeComponent = ({ supportersTree }) => {
  console.log(supportersTree);
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB" });

  const nodeWidth = 270;
  const nodeHeight = 150;

  const processNode = (node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    node.referred?.forEach((child) => {
      dagreGraph.setEdge(node.id, child.id);
      processNode(child);
    });
  };

  if (supportersTree && supportersTree.length > 0) {
    processNode(supportersTree[0]);
  }

  dagre.layout(dagreGraph);

  let nodes = [];
  let edges = [];

  const createNode = (node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      id: node.id.toString(),
      type: "supporter",
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
      data: { label: node.user.name, level: node.level },
    };
  };

  const createEdge = (source, target) => ({
    id: `e${source}-${target}`,
    source: source.toString(),
    target: target.toString(),
    type: "smoothstep",
  });

  const processSupporter = (supporter) => {
    nodes.push(createNode(supporter));
    supporter.referred?.forEach((child) => {
      edges.push(createEdge(supporter.id, child.id));
      processSupporter(child);
    });
  };

  if (supportersTree && supportersTree.length > 0) {
    processSupporter(supportersTree[0]);
  }

  const fitViewOptions = { minZoom: 0.8 };
  const nodeTypes = { supporter: SupporterNode };

  return (
    <div className="h-[calc(100vh-80px-50px)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        proOptions={{
          hideAttribution: true,
        }}
        fitViewOptions={fitViewOptions}
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Controls fitViewOptions={fitViewOptions} />
      </ReactFlow>
    </div>
  );
};

export default TreeComponent;
