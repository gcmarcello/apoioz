"use client";

import React, { useEffect, useState } from "react";
import { PanelContext } from "../contexts/panel.ctx";
import { SidebarContext } from "../contexts/sidebar.ctx";
import { Campaign, Prisma, Supporter, User } from "@prisma/client";

export interface CampaignOptions {
  primaryColor?: string;
  secondaryColor?: string;
}

export default function SidebarProvider({
  children,
  user,
  campaign,
  supporter,
}: {
  children: React.ReactNode;
  user: Omit<Prisma.UserGetPayload<{ include: { info: true } }>, "password">;
  campaign: Campaign;
  supporter: Supporter;
}) {
  const [visibility, setVisibility] = useState({
    supporterSidebar: false,
    panelTopbar: true,
    panelSidebar: false,
  });

  const campaignOptions = campaign.options as CampaignOptions;

  const primaryColor = campaignOptions.primaryColor;
  const secondaryColor = campaignOptions.secondaryColor;
  return (
    <SidebarContext.Provider
      value={{
        visibility,
        setVisibility,
        user,
        campaign,
        supporter,
        primaryColor,
        secondaryColor,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
