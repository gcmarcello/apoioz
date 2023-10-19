import { Section, Zone } from "@prisma/client";

export type SupporterTableType = {
  assignedAt: Date;
  campaignId: string;
  id: string;
  level: number;
  referral: any;
  referralId: string;
  referred: any;
  user: {
    email: string;
    id: string;
    info: {
      Section: Section;
      Zone: Zone;
      birthDate: null;
      cityId: string;
      partyId?: string;
      phone: string;
      sectionId: string;
      stateId: null;
      userId: string;
      zoneId: string;
    };
    name: string;
    role: string;
    referral: {
      user: { email: string; id: string; name: string; role: string };
    };
  };
  userId: string;
  options: any;
};
