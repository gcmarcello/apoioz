import { readSupporterBranches } from "@/app/api/panel/supporters/service";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterWithReferralWithUser } from "prisma/types/Supporter";
import TreeComponent from "../arvore/components/TreeComponent";
import ReactFlowWrapper from "./App";
import { Edge, Node } from "reactflow";
import styles from "./styles.module.css";

export const createNode = (supporter: SupporterWithReferralWithUser) => {
  return {
    id: supporter.id,
    type: "supporter",
    position: {
      x: 0,
      y: 0,
    },
    className: styles.node,
    data: {
      label: supporter.user.name,
      level: supporter.level,
    },
  };
};

export const createEdge = (source: string, target: string) => ({
  id: `e${source}->${target}`,
  source: source,
  target: target,
});

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

export default async function TimePage() {
  const { request: parsedRequest } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(SupporterSessionMiddleware);

  const tree = await readSupporterBranches({
    ...parsedRequest,
    where: {
      branches: 1,
    },
  }).then((res) => {
    const { referred, ...rest } =
      res as any as SupporterWithReferralWithUser & {
        referred: SupporterWithReferralWithUser[];
      };
    return [rest, ...referred];
  });

  if (!tree) return;

  const { nodes: initialNodes, edges: initialEdges } = processNodesEdges({
    supporters: tree,
  });

  return (
    <ReactFlowWrapper initialEdges={initialEdges} initialNodes={initialNodes} />
  );
}
