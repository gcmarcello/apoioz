import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { Campaign, Prisma, Supporter } from "@prisma/client";
import { UserWithoutPassword } from "prisma/types/User";

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
  user: UserWithoutPassword;
  campaign: Campaign;
  supporter: Supporter;
  campaigns: Campaign[];
}

export const SidebarContext = createContext(new SidebarContextProps());
