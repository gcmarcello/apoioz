import {
  getCampaign,
  listSupporters,
} from "@/backend/resources/campaign/campaign.service";
import LatestSupporters from "@/frontend/panel/shared/components/latestSupporters";
import MainStats from "@/frontend/panel/shared/components/mainStats";
import Footer from "@/frontend/shared/components/footer";
import { headers } from "next/headers";

export default async function Panel() {
  const userId = headers().get("userId")!;
  const campaign = await getCampaign(userId);
  const supporters = await listSupporters({
    pagination: { pageIndex: 0, pageSize: 4 },
  });

  if (!supporters) return;

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
