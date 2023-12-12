import { readSupportersAsTree } from "@/app/api/panel/supporters/service";
import TreeComponent from "./components/TreeComponent";
import {
  createNode,
  createEdge,
  processNodesEdges,
} from "./components/TreeComponent/lib/nodesEdges";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";

export default async function TimePage() {
  /**
   * await UseMiddlewares()
    .then(CampaignLeaderMiddleware)
    .catch(() => redirect("/painel"));
   */

  const { request: parsedRequest } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(SupporterSessionMiddleware);

  const tree = await readSupportersAsTree(parsedRequest);

  if (!tree) return;

  console.log(tree);

  const { nodes: initialNodes, edges: initialEdges } = processNodesEdges({
    supporters: tree,
  });

  return <TreeComponent initialNodes={initialNodes} initialEdges={initialEdges} />;
}
