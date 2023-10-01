import { headers } from "next/headers";
import { listCampaigns, listSupporters } from "../../resources/api/services/campaign";
import MainStats from "../../resources/panel/components/mainStats";
import LatestSupporters from "../../resources/panel/components/latestSupporters";
import { getLatestSupporters } from "../../resources/panel/server/mainStats";
import Footer from "../../common/components/footer";

export default async function Panel() {
  const userId = headers().get("userId")!;
  const campaigns = await listCampaigns(userId);
  const supporters = await getLatestSupporters(userId, campaigns[0].id);
  return (
    <>
      <MainStats campaign={campaigns[0]} />
      <LatestSupporters campaign={campaigns[0]} userId={userId} supporters={supporters} />
      <Footer />
    </>
  );
}
