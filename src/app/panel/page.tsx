import { headers } from "next/headers";
import { listCampaigns, listSupporters } from "../../resources/api/campaign";
import MainStats from "../../resources/panel/components/mainStats";
import LatestSupporters from "../../resources/panel/components/latestSupporters";

export default async function Panel() {
  const userId = headers().get("userId")!;
  const campaigns = await listCampaigns(userId);

  return (
    <>
      <MainStats />
      <LatestSupporters campaign={campaigns[0]} userId={userId} />
    </>
  );
}
