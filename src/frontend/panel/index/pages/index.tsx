import Footer from "@/frontend/shared/components/footer";
import { headers } from "next/headers";
import LatestSupporters from "../../shared/components/latestSupporters";
import MainStats from "../../shared/components/mainStats";
import {
  getCampaign,
  listSupporters,
} from "@/backend/resources/campaign/campaign.service";

export default async function PanelPage() {
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
