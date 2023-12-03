import prisma from "prisma/prisma";
import StatsSection from "../../_shared/components/StatsSection";
import { getCampaign } from "@/app/api/panel/campaigns/service";
import { cookies, headers } from "next/headers";
import { listPolls } from "@/app/api/panel/polls/service";
import PollsTable from "./components/PollsTable";

export default async function PesquisasPage() {
  const activeCampaignId = cookies().get("activeCampaign")?.value;
  const userId = headers().get("userId");
  const user = await prisma.user.findFirst({ where: { id: userId } });
  const campaign = await getCampaign({ campaignId: activeCampaignId });

  const polls = await listPolls({ campaignId: activeCampaignId });
  return (
    <>
      <StatsSection campaign={campaign} user={user} />
      <PollsTable polls={polls} />
    </>
  );
}
