import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PanelSideBar from "../../common/components/panelSidebar";
import { cookies, headers } from "next/headers";
import { getZones } from "../../resources/api/services/locations";
import { ZoneType } from "../../common/types/locationTypes";

import PanelProvider from "../../common/providers/panelProvider";

import ChooseCampaign from "../../resources/panel/components/chooseCampaign";
import { getCampaign, listCampaigns } from "../../resources/api/services/campaign";
import { redirect } from "next/navigation";
import Toast from "../../common/components/toast";
import Footer from "../../common/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ApoioZ - Painel",
  description: "Painel de Controle",
  themeColor: "#FFFFFF",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const userId = headers().get("userId")!;
  const activeCampaignId = cookies().get("activeCampaign")?.value || undefined;
  const userCampaigns = await listCampaigns(userId);

  return (
    <main>
      <PanelProvider userId={userId} activeCampaignId={activeCampaignId}>
        <ChooseCampaign campaigns={userCampaigns} />
        <PanelSideBar content={children} userId={userId} />
      </PanelProvider>
    </main>
  );
}
