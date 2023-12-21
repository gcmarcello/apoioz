import { prisma } from "prisma/prisma";
import StatsSection from "../../_shared/components/StatsSection";
import { readCampaign } from "@/app/api/panel/campaigns/service";
import { cookies, headers } from "next/headers";
import { readPolls, readPollsStats } from "@/app/api/panel/polls/service";
import PollsTable from "./components/PollsTable";
import PageHeader from "../../_shared/components/PageHeader";
import { CampaignLeaderMiddleware } from "@/middleware/functions/campaignLeader.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { redirect } from "next/navigation";
import { showToast } from "../../_shared/components/alerts/toast";

export default async function PesquisasPage() {
  await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(SupporterSessionMiddleware)
    .then(CampaignLeaderMiddleware)
    .catch(() => {
      redirect("/painel");
    });

  const activeCampaignId = cookies().get("activeCampaign")?.value;

  if (!activeCampaignId) return redirect("/painel");

  const polls = await readPolls({ campaignId: activeCampaignId });
  const stats = await readPollsStats({ campaignId: activeCampaignId });
  return (
    <>
      <PageHeader
        title="Painel de Pesquisas"
        primaryButton={{ href: "./pesquisas/nova", text: "Nova Pesquisa" }}
      />
      <StatsSection stats={stats} />
      <div className="mt-4">
        <PollsTable polls={polls} />
      </div>
    </>
  );
}
