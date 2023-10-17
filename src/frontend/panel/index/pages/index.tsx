import Footer from "@/frontend/shared/components/footer";
import LatestSupporters from "../../shared/components/latestSupporters";
import MainStats from "../../shared/components/mainStats";
import { cookies, headers } from "next/headers";
import {
  generateMainPageStats,
  getCampaign,
  listSupporters,
} from "@/backend/resources/campaign/campaign.service";

export default async function PanelPage() {
  const userId = headers().get("userId")!;
  const supporters = await listSupporters({
    pagination: { pageIndex: 0, pageSize: 5 },
  });

  if (!supporters) return;

  return (
    <>
      <MainStats />
      <LatestSupporters userId={userId} supporters={supporters} />
      <Footer />
    </>
  );
}
