import { readCampaign } from "@/app/api/panel/campaigns/actions";
import CampaignUpdateForm from "./components/CampaignUpdateForm";
import { cookies, headers } from "next/headers";
import LeaveCampaignForm from "./components/LeaveCampaignForm";
import { redirect } from "next/navigation";

export default async function CampaignSettings() {
  const campaignId = cookies().get("activeCampaign")?.value;
  const userId = headers().get("userId");

  if (!campaignId || !userId) return redirect("/painel");

  const campaign = await readCampaign({ campaignId });

  if (!campaign) return redirect("/painel");

  const supporter = await prisma.supporter.findFirst({
    where: {
      userId,
      campaignId,
    },
  });

  if (!supporter) return redirect("/painel");

  if (supporter.level === 4) return <CampaignUpdateForm campaign={campaign} />;
  return <LeaveCampaignForm campaign={campaign} />;
}
