import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { Campaign, Prisma, Supporter } from "@prisma/client";

export class SidebarContextProps {
  visibility: {
    supporterSidebar: boolean;
    panelTopbar: boolean;
    panelSidebar: boolean;
  };
  setVisibility: Dispatch<
    SetStateAction<{
      supporterSidebar: boolean;
      panelTopbar: boolean;
      panelSidebar: boolean;
    }>
  >;
  user: Omit<Prisma.UserGetPayload<{ include: { info: true } }>, "password">;
  campaign: Campaign;
}

export const SidebarContext = createContext(new SidebarContextProps());
