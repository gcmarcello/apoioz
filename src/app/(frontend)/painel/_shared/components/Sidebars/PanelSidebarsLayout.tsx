"use client";
import { Campaign, Prisma } from "@prisma/client";
import PanelSideBar from "./PanelSidebar";
import SupporterSideBar from "./Supporter/SupporterSidebars";
import { SupporterTopBar } from "./PanelTopbar";
import SidebarProvider from "../../providers/SidebarProvider";

export function PanelSidebarsLayout({
  user,
  campaign,
}: {
  user: Omit<Prisma.UserGetPayload<{ include: { info: true } }>, "password">;
  campaign: Campaign;
}) {
  return (
    <SidebarProvider user={user} campaign={campaign}>
      <PanelSideBar />
      <SupporterTopBar />
      <SupporterSideBar />
    </SidebarProvider>
  );
}
