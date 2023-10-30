import type { Campaign, Supporter, User, UserInfo } from "@prisma/client";

import { normalizeEmail, normalizePhone } from "@/(shared)/utils/format";
import dayjs from "dayjs";
import { UserWithoutPassword } from "prisma/types/User";
import { CreateSupportersDto, ListSupportersDto } from "./dto";
import prisma from "prisma/prisma";
import { findCampaignById } from "../campaigns/service";
import { verifyExistingUser } from "../../user/service";

export async function createSupporter(
  request: CreateSupportersDto & {
    userSession: UserWithoutPassword;
    supporterSession: Supporter;
  }
) {
  const existingUser = await verifyExistingUser(request.phone);

  const campaign = await findCampaignById(request.supporterSession.campaignId);

  if (!campaign) throw "Campanha não encontrada";

  if (existingUser) {
    const conflictingSupporter = await verifyConflictingSupporter(
      campaign,
      existingUser.id
    );

    if (conflictingSupporter?.type === "sameCampaign")
      throw "Usuário já cadastrado nesta campanha.";
    if (conflictingSupporter?.type === "otherCampaign") {
      throw "Usuário já cadastrado em outra campanha do mesmo tipo.";
    }
  }

  let referralTree = [request.supporterSession];
  if (referralTree[0].level != 4) {
    while (true) {
      const referral = await prisma.supporter.findFirst({
        where: {
          OR: [
            {
              referralId: referralTree[referralTree.length - 1]?.id,
            },
            {
              level: 4,
            },
          ],
        },
      });

      if (!referral) continue;

      referralTree.push(referral);

      if (referral.level === 4) break;
    }
  }

  const ownedSupporterGroupsFromReferralTree =
    await prisma.supporterGroupMembership.findMany({
      where: {
        supporterId: {
          in: referralTree.map((referral) => referral.id),
        },
        isOwner: true,
      },
    });

  const createSupporterGroupMembershipQuery = ownedSupporterGroupsFromReferralTree.map(
    (supporterGroup) => ({
      isOwner: false,
      supporterGroup: {
        connect: {
          id: supporterGroup.supporterGroupId,
        },
      },
    })
  );

  const user = existingUser
    ? existingUser
    : await prisma.user.create({
        include: {
          info: true,
        },
        data: {
          email: normalizeEmail(request.email),
          password: request.password,
          name: request.name,
          role: "user",
          phone: normalizePhone(request.phone),
          info: {
            create: {
              ...request.info,
              birthDate: dayjs(request.info.birthDate, "DD/MM/YYYY", true).toISOString(),
            },
          },
        },
      });

  const supporter = await prisma.supporter
    .create({
      include: { user: true },
      data: {
        level: 1,
        Section: { connect: { id: user.info.sectionId } },
        Zone: { connect: { id: user.info.zoneId } },
        campaign: { connect: { id: request.supporterSession.campaignId } },
        referral: { connect: { id: request.supporterSession.id } },
        user: { connect: { id: user.id } },
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
    })
    .catch((err) => console.log(err));

  return supporter;
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
      data: parsedList,
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        count,
      },
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

export async function verifyConflictingSupporter(campaign: Campaign, userId: string) {
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
      userId: userId,
      campaignId: { in: conflictingCampaigns },
    },
  });

  if (conflictingSupporter?.campaignId === campaign.id)
    return { type: "sameCampaign", supporter: conflictingSupporter };
  if (conflictingSupporter)
    return { type: "otherCampaign", supporter: conflictingSupporter };
  return null;
}

export async function findCampaignLeader(campaignId: string) {
  return await prisma.supporter.findFirst({
    where: { level: 4 },
  });
}
