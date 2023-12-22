import { ExtractSuccessResponse } from "@/app/api/_shared/utils/ActionResponse";
import { readSupporterBranches } from "@/app/api/panel/supporters/actions";
import { Supporter } from "@prisma/client";
import { SupporterWithReferralWithUser } from "prisma/types/Supporter";
import { Edge, Node } from "reactflow";

export const createEdge = (source: string, target: string) => ({
  id: `e${source}->${target}`,
  source: source,
  target: target,
  type: "smoothstep",
});

export const createNode = (supporter: SupporterWithReferralWithUser) => {
  return {
    id: supporter.id,
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
  supporters: SupporterWithReferralWithUser[];
  includeRoot?: boolean;
  expandNodes?: boolean;
}) {
  const edges: Edge[] = [];
  const nodes: Node[] = [];

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
