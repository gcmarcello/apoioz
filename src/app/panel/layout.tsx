import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PanelSideBar from "../../common/components/panelSidebar";
import { cookies, headers } from "next/headers";

import PanelProvider from "../../common/providers/panelProvider";

import ChooseCampaign from "../../resources/panel/components/chooseCampaign";
import { listCampaigns } from "../../resources/api/services/campaign";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ApoioZ - Painel",
  description: "Painel de Controle",
  themeColor: "#FFFFFF",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const userId = headers().get("userId")!;
  const activeCampaignId = cookies().get("activeCampaign")?.value;
  const userCampaigns = await listCampaigns(userId);

  return (
    <main>
      <PanelProvider userId={userId} activeCampaignId={activeCampaignId}>
        {!activeCampaignId && <ChooseCampaign campaigns={userCampaigns} />}
        <PanelSideBar content={children} userId={userId} />
      </PanelProvider>
    </main>
  );
}
