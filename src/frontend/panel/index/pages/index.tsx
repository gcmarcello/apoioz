import { cookies, headers } from "next/headers";

import Footer from "../../(shared)/components/Footer";
import LatestSupporters from "../components/latestSupporters/LatestSupporters";
import MainStats from "../components/MainStats";
import { getCampaign } from "@/backend/resources/campaign/campaign.actions";
import { findUser } from "@/backend/resources/users/users.actions";
import prisma from "@/tests/client";

export default async function PanelPage() {
  const activeCampaignId = cookies().get("activeCampaign")?.value;
  const userId = headers().get("userId");

  if (!activeCampaignId || !userId) return <></>;

  const user = await findUser(userId);
  const campaign = await getCampaign({ userId, campaignId: activeCampaignId });

  if (!user || !campaign) return <></>;

  return (
    <>
      <MainStats user={user} campaign={campaign} />
      <LatestSupporters />
      <Footer />
    </>
  );
}
