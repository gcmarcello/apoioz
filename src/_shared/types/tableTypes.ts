import { Poll, PollAnswer, PollOption, Section, Zone } from "@prisma/client";

export type SupporterTableType = {
  createdAt: Date;
  campaignId: string;
  id: string;
  level: number;
  referral: any;
  referralId: string;
  referred: any;
  user: {
    email: string;
    id: string;
    phone: string;
    info: {
      Section: Section;
      Zone: Zone;
      birthDate: null;
      cityId: string;
      partyId?: string;
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

export type PollsTableType = {
  id: string;
  active: boolean;
  title: string;
  createdAt: Date;
  campaignId: string;
  activeAtSignUp: boolean;
  PollQuestion: number;
  PollAnswer: number;
};
