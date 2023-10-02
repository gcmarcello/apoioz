export interface NewUserType {
  email: string;
  password?: string;
  name: string;
  stateId?: string;
  cityId?: string;
  phone?: string;
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
  name: string;
  role: string;
  info?: InfoType;
}

export interface InfoType {
  phone: string;
  cityId: string;
  zoneId: string;
  sectionId: string;
}

export interface SupporterType {
  id?: string;
  userId?: string;
  user: UserType;
  referralId: string;
  referral?: any;
  campaignId?: string;
  level?: string;
  campaigns: any[];
}
