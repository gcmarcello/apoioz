import { readSupportersAsTree } from "@/app/api/panel/supporters/service";
import { NoSsrTreeComponent } from "./components/TreeComponent/NoSsrTreeComponent";
import { createNode, createEdge } from "./components/TreeComponent/lib/nodesEdges";
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

  const initialNodes = [];
  const initialEdges = [];

  const processSupporter = (supporter) => {
    supporter.referred?.forEach((child) => {
      initialNodes.push(createNode(child));
      initialEdges.push(createEdge(supporter.id, child.id));
      processSupporter(child);
    });
  };

  initialNodes.push(createNode(tree[0]));

  processSupporter(tree[0]);

  return <NoSsrTreeComponent initialNodes={initialNodes} initialEdges={initialEdges} />;
}
