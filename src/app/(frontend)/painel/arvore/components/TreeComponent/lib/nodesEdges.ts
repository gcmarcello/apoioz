import { readSupportersAsTree } from "@/app/api/panel/supporters/service";

export const createEdge = (source, target) => ({
  id: `e${source}->${target}`,
  source: source.toString(),
  target: target.toString(),
  type: "smoothstep",
});

export const createNode = (node, expandNodes) => {
  return {
    id: node.id.toString(),
    type: "supporter",
    position: {
      x: 0,
      y: 0,
    },
    data: {
      label: node.user.name,
      level: node.level,
      expanded: expandNodes,
      hasChildren: Boolean(node.referred),
    },
  };
};

export function processNodesEdges({
  supporters,
  includeRoot = true,
  expandNodes = false,
}: {
  supporters: Awaited<ReturnType<typeof readSupportersAsTree>>;
  includeRoot?: boolean;
  expandNodes?: boolean;
}) {
  const edges = [];
  const nodes = [];

  includeRoot && nodes.push(createNode(supporters[0], expandNodes));

  const processSupporter = (supporter) => {
    supporter.referred?.forEach((child) => {
      nodes.push(createNode(child, expandNodes));
      edges.push(createEdge(supporter.id, child.id));
      processSupporter(child);
    });
  };

  processSupporter(supporters[0]);

  return { edges, nodes };
}
