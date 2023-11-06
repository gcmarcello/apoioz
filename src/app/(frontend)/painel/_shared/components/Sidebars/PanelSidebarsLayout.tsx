"use client";
import { Campaign, Prisma, Supporter } from "@prisma/client";
import PanelSideBar from "./PanelSidebar";
import SupporterSideBar from "./Supporter/SupporterSidebars";
import { SupporterTopBar } from "./PanelTopbar";
import SidebarProvider from "../../providers/SidebarProvider";

export function PanelSidebarsLayout({
  user,
  campaign,
  supporter,
}: {
  user: Omit<Prisma.UserGetPayload<{ include: { info: true } }>, "password">;
  campaign: Campaign;
  supporter: Supporter;
}) {
  return (
    <SidebarProvider user={user} campaign={campaign} supporter={supporter}>
      <PanelSideBar />
      <SupporterTopBar />
      <SupporterSideBar />
    </SidebarProvider>
  );
}
