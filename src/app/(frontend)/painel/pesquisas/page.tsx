import prisma from "prisma/prisma";
import StatsSection from "../../_shared/components/StatsSection";
import { getCampaign } from "@/app/api/panel/campaigns/service";
import { cookies, headers } from "next/headers";
import { readPolls, readPollsStats } from "@/app/api/panel/polls/service";
import PollsTable from "./components/PollsTable";
import PageHeader from "../../_shared/components/PageHeader";

export default async function PesquisasPage() {
  const activeCampaignId = cookies().get("activeCampaign")?.value;
  const polls = await readPolls({ campaignId: activeCampaignId });

  const stats = await readPollsStats({ campaignId: activeCampaignId });
  return (
    <>
      <PageHeader
        title="Painel de Pesquisas"
        primaryButton={{ href: "./pesquisas/nova", text: "Nova Pesquisa" }}
      />
      <StatsSection stats={stats} />
      <PollsTable polls={polls} />
    </>
  );
}
