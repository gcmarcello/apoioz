import { SectionType, ZoneType } from "./locationTypes";

export interface SignUpType {
  email: string;
  password: string;
  name: string;
}

export interface LoginType {
  identifier: string;
  password: string;
}

export interface TokenGeneratorType {
  id: string;
}
