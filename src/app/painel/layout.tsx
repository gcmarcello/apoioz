import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies, headers } from "next/headers";

import {
  deactivateCampaign,
  getCampaign,
  listCampaigns,
} from "@/backend/resources/campaign/campaign.service";
import PanelSideBar from "@/frontend/panel/(shared)/components/PanelSidebar";
import PanelProvider from "@/frontend/panel/(shared)/providers/panelProvider";
import ChooseCampaign from "@/frontend/panel/index/components/ChooseCampaign";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ApoioZ - Painel",
  description: "Painel de Controle",
  themeColor: "#FFFFFF",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const userId = headers().get("userId")!;

  const activeCampaignId = cookies().get("activeCampaign")?.value;
  let campaign = null;
  if (activeCampaignId) campaign = await getCampaign(userId);
  if (!campaign) deactivateCampaign();
  const userCampaigns = await listCampaigns(userId);

  return (
    <main>
      <PanelProvider userId={userId} fetchedCampaign={campaign}>
        <ChooseCampaign campaigns={userCampaigns} />
        <PanelSideBar content={children} userId={userId} />
      </PanelProvider>
    </main>
  );
}
