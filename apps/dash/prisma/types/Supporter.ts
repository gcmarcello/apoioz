import { Prisma, Supporter } from "../client";

export type SupporterWithReferralUser = Prisma.SupporterGetPayload<{
  include: {
    referral: {
      include: {
        user: true;
      };
    };
  };
}>;

export type SupporterWithUserInfo = Prisma.SupporterGetPayload<{
  include: {
    user: {
      include: {
        info: {
          include: {
            Section: true;
            Zone: true;
            City: true;
          };
        };
      };
    };
  };
}>;

export type SupporterWithUser = Prisma.SupporterGetPayload<{
  include: {
    user: true;
  };
}>;

export type SupporterWithReferralWithUser = Prisma.SupporterGetPayload<{
  include: {
    user: true;
    referral: {
      include: {
        user: true;
      };
    };
  };
}>;

export type SupporterWithReferred = Supporter & { referred: Supporter[] };

export type RecursiveSupporterWithReferred = Supporter & {
  referred: RecursiveSupporterWithReferred[] | undefined;
};
