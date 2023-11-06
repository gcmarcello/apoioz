import { getCampaign } from "@/app/api/panel/campaigns/actions";
import CampaignUpdateForm from "./components/CampaignUpdateForm";
import { cookies, headers } from "next/headers";
import { getSupporterByUser } from "@/app/api/panel/supporters/actions";

export default async function CampaignSettings() {
  const campaign = await getCampaign({
    campaignId: cookies().get("activeCampaign").value,
  });
  const supporter = await getSupporterByUser({
    userId: headers().get("userId"),
    campaignId: campaign.id,
  });
  if (supporter.level === 4) return <CampaignUpdateForm campaign={campaign} />;
  return (
    <div className="mt-10 text-sm">
      Você não tem permissão para acessar as configurações de campanha.
    </div>
  );
}
