"use client";
import { Campaign, Prisma, Supporter } from "@prisma/client";
import PanelSideBar from "./PanelSidebar";
import SupporterSideBar from "./Supporter/SupporterSidebars";
import { SupporterTopBar } from "./PanelTopbar";
import SidebarProvider from "./lib/SidebarProvider";

export function PanelSidebarsLayout({
  user,
  campaign,
  supporter,
  campaigns,
}: {
  user: Omit<Prisma.UserGetPayload<{ include: { info: true } }>, "password">;
  campaign: Campaign;
  supporter: Supporter;
  campaigns: Campaign[];
}) {
  return (
    <SidebarProvider
      user={user}
      campaign={campaign}
      campaigns={campaigns}
      supporter={supporter}
    >
      <PanelSideBar />
      <SupporterTopBar />
      <SupporterSideBar />
    </SidebarProvider>
  );
}
