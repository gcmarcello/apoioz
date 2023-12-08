import { readSupportersAsTree } from "@/app/api/panel/supporters/actions";
import { NoSsrTreeComponent } from "./components/TreeComponent/NoSsrTreeComponent";

export default async function TimePage() {
  /**
   * await UseMiddlewares()
    .then(CampaignLeaderMiddleware)
    .catch(() => redirect("/painel"));
   */

  const tree = await readSupportersAsTree();

  if (!tree) return;

  return <NoSsrTreeComponent supportersTree={tree} />;
}
