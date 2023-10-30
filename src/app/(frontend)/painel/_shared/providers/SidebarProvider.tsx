"use client";

import React, { useEffect, useState } from "react";
import { PanelContext } from "../contexts/panel.ctx";
import { SidebarContext } from "../contexts/sidebar.ctx";
import { Campaign, Prisma, Supporter, User } from "@prisma/client";

export default function SidebarProvider({
  children,
  user,
  campaign,
}: {
  children: React.ReactNode;
  user: Omit<Prisma.UserGetPayload<{ include: { info: true } }>, "password">;
  campaign: Campaign;
}) {
  const [visibility, setVisibility] = useState({
    supporterSidebar: false,
    panelTopbar: true,
    panelSidebar: false,
  });

  return (
    <SidebarContext.Provider
      value={{
        visibility,
        setVisibility,
        user,
        campaign,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
