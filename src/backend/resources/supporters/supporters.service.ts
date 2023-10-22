import prisma from "@/backend/prisma/prisma";
import {
  findCampaignById,
  verifyPermission,
} from "../campaign/campaign.service";
import { cookies, headers } from "next/headers";
import { handlePrismaError } from "@/backend/prisma/prismaError";
import { normalizePhone } from "@/shared/utils/format";
import { Campaign, User, UserInfo } from "@prisma/client";
import { verifyExistingUser } from "../users/users.service";

export async function createSupporter(data: any) {
  try {
    const { name, email, password, campaign, ...info } = data;

    const checkForExistingUser = await verifyExistingUser(info.phone);

    const campaignToBe = await findCampaignById(campaign.campaignId);

    if (!campaignToBe) throw new Error("Campanha não encontrada");

    if (checkForExistingUser) {
      const conflictingSupporter = await verifyConflictingSupporter(
        campaignToBe,
        checkForExistingUser
      );

      if (conflictingSupporter)
        throw new Error(
          "Usuário já cadastrado em outra campanha do mesmo tipo"
        );
    }

    const firstReferral = await prisma.supporter.findUnique({
      where: {
        id: campaign.referralId,
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

    const supporter = await prisma.supporter.create({
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
  pagination = { pageSize: 10, pageIndex: 0 },
  ownerId,
  campaignOwnerId,
}: {
  pagination?: { pageSize?: number; pageIndex: number };
  ownerId?: string;
  campaignOwnerId?: string;
}) {
  try {
    const userId = ownerId || headers().get("userId")!;
    const campaignId =
      campaignOwnerId || cookies().get("activeCampaign")!.value;

    const supporter = await prisma.supporter.findFirst({
      where: { userId: userId, campaignId: campaignId },
    });

    if (!supporter) return;

    const supporterGroup = await prisma.supporterGroupMembership.findFirst({
      where: { supporterId: supporter.id, isOwner: true },
    });

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

export async function getSupporterByUser(userId: string, campaignId: string) {
  const supporter = await prisma.supporter.findFirst({
    where: { userId, campaignId },
  });
  if (supporter) return supporter;
}

export async function verifyConflictingSupporter(
  campaign: Campaign,
  userInfo: UserInfo
) {
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
