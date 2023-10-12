import { headers } from "next/headers";
import {
  getCampaign,
  listCampaigns,
  listSupporters,
} from "../../resources/api/services/campaign";
import MainStats from "../../resources/painel/components/mainStats";
import LatestSupporters from "../../resources/painel/components/latestSupporters";
import { getLatestSupporters } from "../../resources/painel/server/mainStats";
import Footer from "../../common/components/footer";

export default async function Panel() {
  const userId = headers().get("userId")!;
  const campaign = await getCampaign(userId);
  const supporters = await listSupporters({
    pagination: { pageIndex: 0, pageSize: 4 },
  });

  return (
    <>
      <MainStats campaign={campaign} />
      <LatestSupporters
        campaign={campaign}
        userId={userId}
        supporters={supporters}
      />
      <Footer />
    </>
  );
}
