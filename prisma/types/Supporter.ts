import { Prisma } from "@prisma/client";

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
