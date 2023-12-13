import { readSupportersAsTree } from "@/app/api/panel/supporters/service";
import { Supporter } from "@prisma/client";
import { SupporterWithUserInfo } from "prisma/types/Supporter";

export const createEdge = (source, target) => ({
  id: `e${source}->${target}`,
  source: source.toString(),
  target: target.toString(),
  type: "smoothstep",
});

export const createNode = (supporter: any, expanded = false) => {
  return {
    id: supporter.id.toString(),
    type: "supporter",
    position: {
      x: 0,
      y: 0,
    },
    data: {
      label: supporter.user.name,
      level: supporter.level,
    },
  };
};

export function processNodesEdges({
  supporters,
}: {
  supporters: any;
  includeRoot?: boolean;
  expandNodes?: boolean;
}) {
  const edges = [];
  const nodes = [];

  supporters.forEach((supporter) => {
    const shouldCreateSupporterNode = !nodes.some((n) => n.id === supporter.id);

    if (!shouldCreateSupporterNode) return;

    nodes.push(createNode(supporter));

    const referral = supporters.find((s) => s.id === supporter.referralId);

    if (!referral) return;

    edges.push(createEdge(referral.id, supporter.id));
  });

  return { edges, nodes };
}
