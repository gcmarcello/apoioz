import { Supporter } from "@prisma/client";
import { UserWithoutPassword } from "prisma/types/User";
import { ReadSupportersAsTreeDto, ReadSupportersDto } from "../dto";

export async function readSupportersAsTree({
  supporterSession,
  where: { hierarchyLevel = 2, supporterId = null } = {},
}: ReadSupportersAsTreeDto & {
  userSession: UserWithoutPassword;
  supporterSession: Supporter;
}) {
  function generateReferredObject(hierarchyLevel: any): any {
    if (hierarchyLevel === 1) {
      return {
        referral: { include: { user: { include: { info: true } } } },
        user: { include: { info: { include: { Section: true, Zone: true } } } },
      };
    } else {
      return {
        referred: {
          include: {
            referral: { include: { user: { include: { info: true } } } },
            user: {
              include: { info: { include: { Section: true, Zone: true } } },
            },
            ...generateReferredObject(hierarchyLevel - 1),
          },
        },
      };
    }
  }

  const supporterTree = await prisma.supporterGroupMembership
    .findFirst({
      where: {
        supporterId: supporterId || supporterSession.id,
        supporterGroup: {
          memberships: {
            some: {
              supporterId: supporterSession.id,
              isOwner: true,
            },
          },
        },
      },
      include: {
        supporter: {
          include: {
            referred: {
              include: {
                referral: { include: { user: { include: { info: true } } } },
                user: {
                  include: {
                    info: { include: { Section: true, Zone: true } },
                  },
                },
                ...generateReferredObject(hierarchyLevel - 1),
              },
            },
            user: {
              include: {
                info: { include: { Section: true, Zone: true } },
              },
            },
            referral: { include: { user: { include: { info: true } } } },
          },
        },
      },
    })
    .then((m) => m.supporter);

  if (!supporterTree) throw "Você não tem permissão para acessar este apoiador";

  return supporterTree;
}

export async function readSupporterTrail({
  supporterSession,
  where: { supporterId },
}: ReadSupportersAsTreeDto & {
  userSession: UserWithoutPassword;
  supporterSession: Supporter;
}) {
  const referralSupporterGroups = await prisma.supporterGroup.findMany({
    where: {
      memberships: {
        some: {
          supporterId: supporterId,
        },
      },
    },
  });

  const notFlattenedReferrals = await prisma.supporterGroupMembership
    .findMany({
      where: {
        supporterGroupId: {
          in: referralSupporterGroups.map((group) => group.id),
        },
        isOwner: true,
      },
      include: {
        supporter: {
          include: {
            referred: {
              include: {
                user: true,
              },
            },
            user: true,
          },
        },
      },
    })
    .then((res) => res.map((m) => m.supporter));

  const referrals = notFlattenedReferrals.reduce((acc, curr) => {
    return [...acc, curr, ...curr.referred];
  }, []);

  return referrals;
}

export async function readSupportersGroupSupporters({
  pagination,
  where,
  supporterSession,
}: ReadSupportersDto & {
  supporterSession: Supporter;
}) {
  const supporterGroupMembership = await prisma.supporterGroupMembership.findFirst({
    where: { supporterId: supporterSession.id, isOwner: true },
  });

  if (!supporterGroupMembership)
    throw "Você não tem permissão para acessar este grupo de apoio.";

  const supporterList = await prisma.supporter.findMany({
    take: pagination?.pageSize,
    where: {
      campaignId: supporterSession.campaignId,
      supporterGroupsMemberships: {
        some: {
          supporterGroupId: supporterGroupMembership?.supporterGroupId,
        },
      },
      user: {
        name: { contains: where?.user.name },
        email: { contains: where?.user.email },
        phone: { contains: where?.user.phone },
      },
    },
    include: {
      user: {
        include: {
          info: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    data: supporterList,
    pagination: {
      pageIndex: pagination?.pageIndex,
      pageSize: pagination?.pageSize,
      count: supporterList.length + 1,
    },
  };
}

export async function readSupportersGroupSupportersWithRelation({
  pagination,
  where,
  supporterSession,
}: ReadSupportersDto & {
  supporterSession: Supporter;
}) {
  const supporterGroup = await prisma.supporterGroupMembership.findFirst({
    where: { supporterId: supporterSession?.id, isOwner: true },
  });

  if (!supporterGroup) throw "Você não tem permissão para acessar este grupo de apoio.";

  const supporterList = await prisma.supporter.findMany({
    take: pagination?.pageSize,
    where: {
      campaignId: supporterSession.campaignId,
      supporterGroupsMemberships: {
        some: {
          supporterGroupId: supporterGroup?.supporterGroupId,
        },
      },
      user: {
        name: { contains: where?.user.name },
        email: { contains: where?.user.email },
        phone: { contains: where?.user.phone },
      },
    },
    include: {
      user: {
        select: {
          info: { include: { Section: true, Zone: true } },
          name: true,
          email: true,
          phone: true,
        },
      },
      referral: {
        include: {
          user: {
            select: {
              info: { include: { Section: true, Zone: true } },
              name: true,
              email: true,
              phone: true,
            },
          },
          referral: {
            include: {
              user: {
                select: {
                  info: { include: { Section: true, Zone: true } },
                  name: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    data: supporterList,
    pagination: {
      pageIndex: pagination?.pageIndex,
      pageSize: pagination?.pageSize,
      count: supporterList.length + 1,
    },
  };
}

export async function readSupporterFromUser({
  userId,
  campaignId,
}: {
  userId: string;
  campaignId: string;
}) {
  const supporter = await prisma.supporter.findFirst({
    where: { userId, campaignId },
  });
  if (supporter) return supporter;
}
