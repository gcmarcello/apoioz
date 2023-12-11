import { Supporter, Zone } from "@prisma/client";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import crypto from "crypto";

import prisma from "prisma/prisma";
import { readZonesByCity, readZonesByState } from "../../elections/zones/actions";

export async function verifyPermission(
  userId: string | null,
  campaignId: string
): Promise<Supporter> {
  try {
    if (!userId)
      throw {
        message: `Você não tem permissão para acessar os dados dessa campanha.`,
        status: 403,
      };
    const validateCampaignSupporter = await prisma.supporter.findFirst({
      where: { campaignId: campaignId, userId: userId },
    });

    if (!validateCampaignSupporter?.level)
      throw {
        message: `Você não tem permissão para acessar os dados dessa campanha.`,
        status: 403,
      };

    return validateCampaignSupporter;
  } catch (error) {
    throw error;
  }
}

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
        message: `Você não tem permissão para acessar os dados dessa campanha.`,
        status: 403,
      });

    return { ...campaign, zones };
  } catch (error) {
    throw error;
  }
}

export async function generateMainPageStats({
  userId,
  campaignId,
}: {
  userId: string;
  campaignId: string;
}) {
  await verifyPermission(userId, campaignId);
  const totalSupporters = await prisma.supporter.count({
    where: { campaignId: campaignId },
  });
  const supportersLastWeek = await prisma.supporter.count({
    where: {
      campaignId: campaignId,
      createdAt: { lt: dayjs().subtract(1, "week").toISOString() },
    },
  });
  const mostFrequentReferralId = await prisma.supporter.groupBy({
    where: { campaignId: campaignId },
    by: ["referralId"],
    _count: {
      referralId: true,
    },
    orderBy: {
      _count: {
        referralId: "desc",
      },
    },

    take: 1,
  });

  const mostFrequentReferral = await prisma.supporter.findUnique({
    where: { id: mostFrequentReferralId[0].referralId! || userId },
    include: { user: { select: { name: true } } },
  });

  const supporters = await prisma.supporter.findMany({
    where: { campaignId: campaignId },
    include: {
      user: {
        include: {
          info: {
            select: { Section: { include: { Address: true } }, Zone: true },
          },
        },
      },
    },
  });

  const sectionCounts: any[] = [];

  supporters.forEach((supporter) => {
    const section = supporter.user.info?.Section;
    const zone = supporter.user.info?.Zone;
    const index = sectionCounts.findIndex(
      (supporter) => section?.id === supporter.section?.id
    );
    if (index === -1) {
      sectionCounts.push({ section: section, zone: zone, count: 1 });
    } else {
      sectionCounts[index] = {
        ...sectionCounts[index],
        count: sectionCounts[index].count + 1,
      };
    }
  });

  const leadingSection = sectionCounts.sort((a, b) => b.count - a.count)[0];

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

  const supporterGroup = await prisma.supporterGroup.create({
    data: {},
  });

  const campaign = await prisma.campaign.create({
    data: {
      userId: data.userId,
      name: data.name,
      type: data.type,
      cityId: data.cityId,
      stateId: data.stateId,
      year: data.year,
      supporters: {
        create: {
          id: supporterId,
          userId: data.userId,
          level: 4,
          supporterGroupsMemberships: {
            create: [
              {
                isOwner: true,
                supporterGroupId: supporterGroup.id,
              },
            ],
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
