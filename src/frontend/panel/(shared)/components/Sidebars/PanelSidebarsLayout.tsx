'use client'
import { User, Campaign } from "@prisma/client";
import PanelSideBar from "./PanelSidebar";
import SupporterSideBar from "./Supporter/Sidebar/SupporterSidebars";
import { SupporterTopBar } from "./Supporter/SupporterTobBar";

export function PanelSidebarsLayout({
  user,
  campaign,
}: {
  user: User;
  campaign: Campaign;
}) {

  const 

  return (
    <>
      <PanelSideBar user={user} campaign={campaign} />
      <SupporterTopBar user={user} campaign={campaign} />
      <SupporterSideBar user={user} campaign={campaign} />
    </>
  );
}
