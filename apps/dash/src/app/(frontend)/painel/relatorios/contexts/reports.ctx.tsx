import { ExtractSuccessResponse } from "odinkit";
import { readSupportersFromSupporterGroupWithRelation } from "@/app/api/panel/supporters/actions";
import { User } from "@prisma/client";
import { Dispatch, createContext } from "react";

export class ReportsContextProps {
  supporters: {
    pagination: any;
    data: ExtractSuccessResponse<
      typeof readSupportersFromSupporterGroupWithRelation
    >;
  };
  openAsSupporter: (supporterId: string) => void;
  restoreView: () => void;
  viewingAs: User | undefined;
  setViewingAs: Dispatch<User>;
  globalFilter: string;
  setGlobalFilter: Dispatch<string>;
}

export const ReportsContext = createContext(new ReportsContextProps());
