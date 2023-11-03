import { cookies, headers } from "next/headers";
import prisma from "@/tests/client";
import { getCampaign } from "@/app/api/panel/campaigns/actions";
import MainStats from "./(index)/components/MainStats";
import Footer from "./_shared/components/Footer";
import { LatestSupporters } from "./(index)/components/latestSupporters/LatestSupporters";

export default async function PanelPage() {
  const activeCampaignId = cookies().get("activeCampaign")?.value;
  const userId = headers().get("userId");

  if (!activeCampaignId || !userId) return <></>;

  const user = await prisma.user.findFirst({ where: { id: userId } });
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
