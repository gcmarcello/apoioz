import { Supporter, Zone } from "@prisma/client";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import crypto from "crypto";

import prisma from "prisma/prisma";
import { readZonesByCity, readZonesByState } from "../../elections/zones/actions";
import { readZonesByCampaign } from "../../elections/zones/service";
import { getEnv } from "@/_shared/utils/settings";
import { SupporterSession } from "@/middleware/functions/supporterSession.middleware";

export async function findCampaignById(campaignId: string) {
  return await prisma.campaign.findFirst({
    where: { id: campaignId },
  });
}

export async function listCampaigns(userId: string) {
  try {
    return await prisma.campaign.findMany({
      where: { OR: [{ supporters: { some: { userId: userId } } }, { userId }] },
      include: { _count: { select: { supporters: true } } },
    });
  } catch (error) {
    throw error;
  }
}

export async function updateCampaign(request: any) {
  try {
    const { userSession, supporterSession, ...data } = request;

    const slugAvailability = await prisma.campaign.findFirst({
      where: { slug: data.slug },
    });

    if (slugAvailability) throw "Slug já está em uso por outra campanha.";

    const updatedCampaign = await prisma.campaign.update({
      where: { id: supporterSession.campaignId },
      data,
    });
    return updatedCampaign;
  } catch (error) {
    throw error;
  }
}

export async function readCampaign(request: { campaignId?: string; slug?: string }) {
  const campaign = await prisma.campaign.findFirst({
    where: request.campaignId ? { id: request.campaignId } : { slug: request.slug },
  });

  return campaign;
}

export async function readCampaignBasicInfo(campaignId: string) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    let zones;

    if (campaign?.cityId) {
      zones = await readZonesByCity(campaign?.cityId);
    }

    if (campaign?.stateId) {
      zones = await readZonesByState(campaign?.stateId);
    }

    if (!campaign)
      return NextResponse.json({
        message: `Essa campanha não existe.`,
        status: 403,
      });

    return { ...campaign, zones };
  } catch (error) {
    throw error;
  }
}

export async function generateMainPageStats(supporterSession: SupporterSession) {
  const totalSupporters = await prisma.supporter.count({
    where: {
      SupporterGroup: {
        some: {
          ownerId: supporterSession.id,
        },
      },
    },
  });

  const supportersLastWeek = await prisma.supporter.count({
    where: {
      SupporterGroup: {
        some: {
          ownerId: supporterSession.id,
        },
      },
      createdAt: { lt: dayjs().subtract(1, "week").toISOString() },
    },
  });

  const mostFrequentReferralId = await prisma.supporter.groupBy({
    by: ["referralId"],
    where: {
      SupporterGroup: {
        some: {
          ownerId: supporterSession.id,
        },
      },
    },
    _count: {
      referralId: true,
    },
    orderBy: {
      _count: {
        referralId: "desc",
      },
    },
  });

  const mostFrequentReferral = await prisma.supporter.findUnique({
    where: { id: mostFrequentReferralId[0].referralId },
  });

  const mostFrequentSection = await prisma.userInfo.groupBy({
    by: ["sectionId"],
    where: {
      user: {
        supporter: {
          some: {
            SupporterGroup: {
              some: {
                ownerId: supporterSession.id,
              },
            },
          },
        },
      },
    },
    _count: {
      sectionId: true,
    },
    orderBy: {
      _count: {
        sectionId: "desc",
      },
    },
  });

  const leadingSection = await prisma.section.findUnique({
    where: { id: mostFrequentSection[0].sectionId },
  });

  return {
    totalSupporters,
    supportersLastWeek,
    leadingSection,
    referralLeader: {
      ...mostFrequentReferral,
      count: mostFrequentReferralId[0]._count.referralId,
    },
  };
}

export async function readCampaignTeamMembers(campaignId: string) {
  const teamMembers = await prisma.supporter.findMany({
    where: { campaignId: campaignId, level: { gt: 1 } },
    include: {
      user: { include: { info: { include: { City: true, Zone: true } } } },
    },
  });
  return teamMembers;
}

export async function createCampaign(data: any) {
  const supporterId = crypto.randomUUID();

  const campaign = await prisma.campaign.create({
    data: {
      supporters: {
        create: {
          id: supporterId,
          userId: data.userId,
          level: 4,
          SupporterGroup: {
            create: {},
          },
        },
      },
    },
    include: {
      supporters: true,
    },
  });

  return { campaign };
}

export async function verifyConflictingZone({
  userId,
  campaignId,
}: {
  userId: string;
  campaignId: string;
}) {
  const userWithoutZone = await prisma.user.findFirst({
    where: { id: userId, info: { zoneId: null } },
  });

  if (userWithoutZone)
    return { type: "noZone", message: "Usuário sem zona", status: true };

  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: { info: true },
  });

  if (!user) return { type: "noUser", message: "Usuário não encontrado", status: true };

  const campaignZones = await readZonesByCampaign(campaignId);

  if (campaignZones.filter((zone) => zone.id === user.info.zoneId).length > 0)
    return {
      type: "wrongRegion",
      message: "Zona do usuário fora da região",
      status: true,
    };

  return { message: "Zona do usuário corresponde à campanha", status: false };
}
