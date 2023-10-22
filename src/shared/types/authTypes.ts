import { SectionType, ZoneType } from "./locationTypes";

export interface SignUpType {
  user: {
    name: string;
    email: string;
    phone: string;
    password: string;
    stateId: string;
    cityId: string;
    zoneId: string;
    sectionId: string;
    birthDate: string;
  };
  campaign?: {
    userId?: string;
    type: string;
    partyId: string;
    cityId: string;
    stateId: string;
    year: string;
  };
}

export interface LoginType {
  identifier: string;
  password: string;
}

export interface TokenGeneratorType {
  id: string;
}
