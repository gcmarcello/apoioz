import { Event, Supporter, User } from "@prisma/client";
import { Dispatch, createContext } from "react";

export class ReportsContextProps {
  supporters: { pagination: any; data: Supporter[] };
  setSupporters: Dispatch<{ pagination: any; data: Supporter[] }> | null;
  openAsSupporter: (user: any, campaignId: string) => void;
  restoreView: () => void;
  viewingAs: User;
  setViewingAs: Dispatch<User>;
  globalFilter: string;
  setGlobalFilter: Dispatch<string>;
}

export const ReportsContext = createContext(new ReportsContextProps());
