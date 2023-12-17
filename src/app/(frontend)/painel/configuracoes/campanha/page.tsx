import { readCampaign } from "@/app/api/panel/campaigns/actions";
import CampaignUpdateForm from "./components/CampaignUpdateForm";
import { cookies, headers } from "next/headers";
import { readSupporterFromUser } from "@/app/api/panel/supporters/actions";
import LeaveCampaignForm from "./components/LeaveCampaignForm";

export default async function CampaignSettings() {
  const campaign = await readCampaign({
    campaignId: cookies().get("activeCampaign").value,
  });
  const supporter = await readSupporterFromUser({
    userId: headers().get("userId"),
    campaignId: campaign.id,
  });
  if (supporter.level === 4) return <CampaignUpdateForm campaign={campaign} />;
  return <LeaveCampaignForm campaign={campaign} />;
}
