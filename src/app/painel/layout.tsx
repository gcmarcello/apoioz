import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PanelSideBar from "../../common/components/panelSidebar";
import { cookies, headers } from "next/headers";

import PanelProvider from "../../common/providers/panelProvider";

import ChooseCampaign from "../../resources/painel/components/chooseCampaign";
import {
  getCampaign,
  listCampaigns,
} from "../../resources/api/services/campaign";
import Toast from "../../common/components/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ApoioZ - Painel",
  description: "Painel de Controle",
  themeColor: "#FFFFFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = headers().get("userId")!;
  const activeCampaignId = cookies().get("activeCampaign")?.value;
  let campaign = null;
  if (activeCampaignId) campaign = await getCampaign(userId);
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
