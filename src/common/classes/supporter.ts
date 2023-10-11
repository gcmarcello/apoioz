import dayjs from "dayjs";
import { ReferralType, UserType } from "../types/userTypes";
import { formatPhone } from "../utils/format";

export class Supporter {
  id: string;
  referralName: string;
  referralLevel: number;
  level: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  userZone: number;
  userSection: number;
  userCity: string;
  assignedAt: string;

  constructor({
    id,
    level,
    referral,
    user,
    assignedAt,
  }: {
    id: string;
    userId: string;
    level: number;
    referral: ReferralType;
    user: UserType;
    assignedAt: Date;
  }) {
    (this.id = id),
      (this.level = level),
      (this.referralName = referral.name),
      (this.referralLevel = referral.supporter.level),
      (this.userName = user.name),
      (this.userEmail = user.email),
      (this.userPhone = formatPhone(user.info.phone)),
      (this.userZone = user.info.Zone!.number),
      (this.userSection = user.info.Section!.number),
      (this.userCity = user.info.Zone?.City?.name!),
      (this.assignedAt = dayjs(assignedAt).format("DD/MM/YYYY"));
  }
}
