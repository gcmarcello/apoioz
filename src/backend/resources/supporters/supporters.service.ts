"use server";
import prisma from "@/backend/prisma/prisma";
import { findCampaignById } from "../campaign/campaign.service";
import { handlePrismaError } from "@/backend/prisma/prismaError";
import type { Campaign, Supporter, User, UserInfo } from "@prisma/client";
import { verifyExistingUser } from "../users/users.service";
import type {
  CreateSupportersDto,
  ListSupportersDto,
} from "@/(shared)/dto/schemas/supporters/supporters";
import { UserWithoutPassword } from "@/backend/prisma/types/User";

export async function createSupporter({
  request,
}: {
  request: CreateSupportersDto & {
    userSession: UserWithoutPassword;
    supporterSession: Supporter;
  };
}) {
  try {
    console.log(request);
    const { name, email, password, ...info } = request;

    const existingUser = await verifyExistingUser(info.phone);

    const campaign = await findCampaignById(request.supporterSession.campaignId);

    if (!campaign) throw new Error("Campanha não encontrada");

    if (existingUser) {
      const conflictingSupporter = await verifyConflictingSupporter(
        campaign,
        existingUser
      );

      if (conflictingSupporter)
        throw new Error("Usuário já cadastrado em outra campanha do mesmo tipo");
    }

    const firstReferral = await prisma.supporter.findUnique({
      where: {
        id: _campaign.referralId,
      },
      include: {
        supporterGroupsMemberships: {
          where: {
            isOwner: true,
          },
        },
      },
    });

    const referrals = [firstReferral];

    while (true) {
      if (firstReferral?.level === 4) break;
      const referral = await prisma.supporter.findFirst({
        where: {
          OR: [
            {
              referralId: referrals[referrals.length - 1]?.id,
            },
            {
              level: 4,
            },
          ],
        },
        include: {
          supporterGroupsMemberships: {
            where: {
              isOwner: true,
            },
          },
        },
      });

      referrals.push(referral);
      if (!Boolean(referral?.referralId)) {
        break;
      }
    }

    const createSupporterGroupMembershipQuery = referrals.map((referral) => ({
      isOwner: false,
      supporterGroup: {
        connect: {
          id: referral?.supporterGroupsMemberships[0].supporterGroupId,
        },
      },
    }));

    await prisma.supporter.create({
      data: {
        level: 1,
        campaign: { connect: { id: campaign.campaignId } },
        referral: { connect: { id: campaign.referralId } },
        user: checkForExistingUser
          ? { connect: { id: checkForExistingUser.userId } }
          : {
              create: {
                email,
                password,
                name,
                role: "user",
                info: { create: info },
              },
            },
        supporterGroupsMemberships: {
          create: [
            {
              isOwner: true,
              supporterGroup: {
                create: {},
              },
            },
            ...createSupporterGroupMembershipQuery,
          ],
        },
      },
    });
  } catch (error) {
    console.log(error);
    return handlePrismaError("usuário", error);
  }
}

export async function listSupporters({
  pagination,
  data,
  supporterSession,
}: ListSupportersDto & {
  userSession: Omit<User, "password">;
  supporterSession: Supporter;
}) {
  try {
    const userId = data?.ownerId || supporterSession.userId;

    const campaignId = data?.campaignOwnerId || supporterSession.campaignId;

    const supporter = await prisma.supporter.findFirst({
      where: { userId: userId, campaignId: campaignId },
    });

    const supporterGroup = await prisma.supporterGroupMembership.findFirst({
      where: { supporterId: supporter?.id, isOwner: true },
    });

    if (!supporter) return;

    const supporterList = await prisma.supporterGroupMembership.findMany({
      where: { supporterGroupId: supporterGroup?.supporterGroupId },
      include: {
        supporter: {
          include: {
            user: {
              include: {
                info: { include: { Section: true, Zone: true, City: true } },
              },
            },
            referral: {
              include: {
                user: {
                  include: {
                    info: {
                      include: { Section: true, Zone: true, City: true },
                    },
                  },
                },
                referral: {
                  include: {
                    user: {
                      include: {
                        info: {
                          include: { Section: true, Zone: true, City: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      orderBy: { supporter: { createdAt: "desc" } },
      take: pagination.pageSize || undefined,
      skip: pagination.pageIndex * (pagination.pageSize || 0),
    });

    const parsedList = supporterList.map((item) => item.supporter);
    const count = await prisma.supporterGroupMembership.count({
      where: { supporterGroupId: supporterGroup?.supporterGroupId },
    });

    return {
      supporters: parsedList,
      meta: { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize },
      count: count,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getSupporterByUser({
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

export async function verifyConflictingSupporter(campaign: Campaign, userInfo: UserInfo) {
  const conflictingCampaigns: string[] = (
    await prisma.campaign.findMany({
      where: {
        cityId: campaign.cityId,
        type: campaign.type,
        year: campaign.year,
      },
    })
  ).map((campaign) => campaign.id);
  const conflictingSupporter = await prisma.supporter.findFirst({
    where: {
      userId: userInfo.userId,
      campaignId: { in: conflictingCampaigns },
    },
  });

  return Boolean(conflictingSupporter);
}

export async function findCampaignLeader(campaignId: string) {
  return await prisma.supporter.findFirst({
    where: { level: 4 },
  });
}
