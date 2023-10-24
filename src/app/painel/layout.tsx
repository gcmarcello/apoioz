import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies, headers } from "next/headers";

import {
  deactivateCampaign,
  listCampaigns,
} from "@/backend/resources/campaign/campaign.actions";
import PanelSideBar from "@/frontend/panel/(shared)/components/PanelSidebar";
import PanelProvider from "@/frontend/panel/(shared)/providers/panelProvider";
import ChooseCampaign from "@/frontend/panel/(shared)/components/ChooseCampaign";
import prisma from "@/tests/client";
import { getCampaign } from "@/backend/resources/campaign/campaign.service";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ApoioZ - Painel",
  description: "Painel de Controle",
  themeColor: "#FFFFFF",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const userId = headers().get("userId")!;

  const activeCampaignId = cookies().get("activeCampaign")?.value;
  if (activeCampaignId && userId) {
    const campaign = await getCampaign({
      userId,
      campaignId: activeCampaignId,
    });

    if (!campaign) return;

    return (
      <main>
        <PanelProvider userId={userId} activeCampaign={campaign}>
          <PanelSideBar content={children} userId={userId} />
        </PanelProvider>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { info: true },
  });

  if (!user) return;

  const userCampaigns = await listCampaigns(user?.id);

  return <ChooseCampaign campaigns={userCampaigns} user={user} />;
}
