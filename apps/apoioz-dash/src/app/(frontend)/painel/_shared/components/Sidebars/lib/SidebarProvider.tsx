"use client";

import React, { useEffect, useState } from "react";
import { SidebarContext } from "./sidebar.ctx";
import { Campaign, Prisma, Supporter, User } from "@prisma/client";
import { CampaignOptions } from "prisma/types/Campaign";

export default function SidebarProvider({
  children,
  user,
  campaign,
  supporter,
  campaigns,
}: {
  children: React.ReactNode;
  user: Omit<Prisma.UserGetPayload<{ include: { info: true } }>, "password">;
  campaign: Campaign;
  supporter: Supporter;
  campaigns: Campaign[];
}) {
  const [visibility, setVisibility] = useState({
    supporterSidebar: false,
    panelTopbar: true,
    panelSidebar: false,
  });

  const campaignOptions = campaign.options as CampaignOptions;

  const primaryColor = campaignOptions?.primaryColor;
  const secondaryColor = campaignOptions?.secondaryColor;
  return (
    <SidebarContext.Provider
      value={{
        visibility,
        setVisibility,
        user,
        campaign,
        supporter,
        campaigns,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
