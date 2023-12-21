import { readSupporterBranches } from "@/app/api/panel/supporters/service";
import TreeComponent from "./components/TreeComponent";
import {
  createNode,
  createEdge,
  processNodesEdges,
} from "./components/TreeComponent/lib/nodesEdges";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { SupporterWithReferred } from "prisma/types/Supporter";

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
    const { referred, ...rest } = res;
    return [rest, ...referred];
  });

  if (!tree) return;

  const { nodes: initialNodes, edges: initialEdges } = processNodesEdges({
    supporters: tree,
  });

  return <TreeComponent initialNodes={initialNodes} initialEdges={initialEdges} />;
}
