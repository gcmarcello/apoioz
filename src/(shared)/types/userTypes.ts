import { SectionType, ZoneType } from "./locationTypes";

export interface listNewUserType {
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
    supporterGroupId: string;
    campaignId: string;
    referralId?: string;
  };
}

export interface UserType {
  id: string;
  email: string;
  password?: string;
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
