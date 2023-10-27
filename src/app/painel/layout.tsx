import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies, headers } from "next/headers";
import { getCampaign } from "@/backend/resources/campaign/campaign.actions";
import ChooseCampaign from "@/frontend/panel/(shared)/components/ChooseCampaign/ChooseCampaign";
import { Toast } from "@/frontend/(shared)/components/alerts/toast";
import { PanelSidebarsLayout } from "@/frontend/panel/(shared)/components/Sidebars/PanelSidebarsLayout";
import prisma from "@/backend/prisma/prisma";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ApoioZ - Painel",
  description: "Painel de Controle",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const userId = headers().get("userId");

  if (!userId) return;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { info: true },
  });

  if (!user) return;

  const activeCampaignId = cookies().get("activeCampaign")?.value;

  if (activeCampaignId && userId) {
    const campaign = await getCampaign({
      userId,
      campaignId: activeCampaignId,
    });

    if (!campaign) return;

    return (
      <main className="">
        <PanelSidebarsLayout campaign={campaign} user={user} />

        <div className="p-8 lg:ml-64">{children}</div>

        <Toast />
      </main>
    );
  }

  return <ChooseCampaign user={user} />;
}
