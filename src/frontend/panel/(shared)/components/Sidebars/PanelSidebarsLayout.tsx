"use client";
import { User, Campaign, Prisma, Supporter } from "@prisma/client";
import PanelSideBar from "./PanelSidebar";
import SupporterSideBar from "./Supporter/SupporterSidebars";
import { SupporterTopBar } from "./PanelTopbar";
import SidebarProvider from "../../providers/SidebarProvider";
import { useToast } from "@/frontend/(shared)/components/hooks/useToast";

export function PanelSidebarsLayout({
  user,
  campaign,
}: {
  user: Omit<Prisma.UserGetPayload<{ include: { info: true } }>, "password">;
  campaign: Campaign;
}) {
  const { toast, setToast } = useToast();
  return (
    <SidebarProvider user={user} campaign={campaign}>
      <PanelSideBar />
      <SupporterTopBar />
      <SupporterSideBar />
    </SidebarProvider>
  );
}
