"use client";
import {
  Address,
  Section,
  Supporter,
  User,
  UserInfo,
  Zone,
} from "prisma/client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type SupporterInfo = Omit<
  User,
  "id" | "updatedAt" | "createdAt" | "role" | "password" | "infoId"
> & {
  info?: UserInfo & {
    Zone: Omit<Zone, "geoJSON"> | null;
    Section: Section | null;
    Address?: Address | null;
  };
};

export type SupporterWithReferral = Supporter & {
  user: SupporterInfo;
  referral?: {
    level: number;
    user: { name: string };
  } | null;
};

export class ReportContextProps {
  zones: Zone[];
  sections: Section[];
  addresses: Address[];
  seeingAs?: SupporterWithReferral;
  supporters: SupporterWithReferral[];
  selectedSupporter: SupporterWithReferral | null;
  setSelectedSupporter: Dispatch<SetStateAction<SupporterWithReferral | null>>;
}

export const ReportContext = createContext<ReportContextProps>(
  new ReportContextProps()
);

export default function ReportProvider({
  children,
  zones,
  sections,
  addresses,
  seeingAs,
  supporters,
}: {
  children: React.ReactNode;
  zones: Zone[];
  sections: Section[];
  addresses: Address[];
  seeingAs?: SupporterWithReferral;
  supporters: SupporterWithReferral[];
}) {
  const [selectedSupporter, setSelectedSupporter] =
    useState<SupporterWithReferral | null>(null);

  return (
    <ReportContext.Provider
      value={{
        zones,
        sections,
        addresses,
        seeingAs,
        supporters,
        selectedSupporter,
        setSelectedSupporter,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

export const useReport = () => {
  const reportContext = useContext(ReportContext);

  return reportContext;
};
