import { SectionType, ZoneType } from "./locationTypes";

export interface NewUserType {
  email: string;
  password?: string;
  name: string;
  stateId?: string;
  cityId?: string;
  phone?: string;
  birthDate?: string;
  zoneId?: string;
  sectionId?: string;
  campaign?: {
    campaignId: string;
    referralId?: string;
  };
}

export interface UserType {
  id: string;
  email: string;
  password?: string | null;
  name: string;
  role: string;
  info: InfoType;
}

export interface InfoType {
  phone: string;
  Zone?: ZoneType;
  City?: any;
  Section?: SectionType;
  cityId: string;
  zoneId: string;
  sectionId: string;
}

export interface SupporterType {
  id: string;
  userId: string;
  user?: UserType;
  referralId: string;
  referral?: ReferralType;
  campaignId: string;
  level: number;
  campaigns?: any[];
}

export interface ReferralType {
  id: string;
  email: string;
  name: string;
  role: string;
  supporter: SupporterType;
}
