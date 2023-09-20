export interface UserType {
  email: string;
  password: string;
  name: string;
  state?: string;
  city?: string;
  phone?: string;
  zone?: string;
  section?: string;
  campaign?: {
    campaignId: string;
    referralId?: string;
  };
}
