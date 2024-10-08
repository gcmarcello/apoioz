import { readCampaign, listCampaigns } from "@/app/api/panel/campaigns/actions";
import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies, headers } from "next/headers";
import { prisma } from "prisma/prisma";
import ChooseCampaign from "./_shared/components/ChooseCampaign/ChooseCampaign";
import { PanelSidebarsLayout } from "./_shared/components/Sidebars/PanelSidebarsLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ApoioZ - Painel",
  description: "Painel de Controle",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = headers().get("userId");

  if (!userId) return;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { info: true },
  });

  if (!user) return;

  const activeCampaignId = cookies().get("activeCampaign")?.value;

  if (!activeCampaignId) return <ChooseCampaign user={user} />;

  const activeCampaign = await readCampaign({
    campaignId: activeCampaignId,
  });

  if (!activeCampaign) return <ChooseCampaign user={user} />;

  const supporter = await prisma.supporter.findFirst({
    where: { userId, campaignId: activeCampaign.id },
  });

  if (!supporter) throw "Apoiador não encontrado.";

  const campaigns = await listCampaigns(user.id);

  return (
    <main>
      <PanelSidebarsLayout
        campaign={activeCampaign}
        campaigns={campaigns}
        user={user}
        supporter={supporter}
      />

      <div className="h-[calc(100vh-80px-30px)] p-3 lg:ml-64 lg:p-8">
        {children}
      </div>
    </main>
  );
}
