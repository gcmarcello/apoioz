import dayjs from "dayjs";
import prisma from "../../../common/utils/prisma";
import { NextResponse } from "next/server";
import { ZoneType } from "../../../common/types/locationTypes";

export async function verifyPermission(userId: string | null, campaignId: string): Promise<number> {
  try {
    if (!userId) throw { message: `Você não tem permissão para acessar os dados dessa campanha.`, status: 403 };
    const validateCampaignSupporter = await prisma.supporter.findFirst({
      where: { campaignId: campaignId, userId: userId },
    });

    if (!validateCampaignSupporter?.level)
      throw { message: `Você não tem permissão para acessar os dados dessa campanha.`, status: 403 };
    return validateCampaignSupporter.level;
  } catch (error) {
    throw error;
  }
}

export async function listCampaigns(userId: string) {
  try {
    return await prisma.campaign.findMany({
      where: { supporters: { some: { userId: userId } } },
      include: { _count: { select: { supporters: true } } },
    });
  } catch (error) {
    throw error;
  }
}

export async function getCampaign(userId: string, campaignId: string) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId, supporters: { some: { userId: userId } } },
    });
    let zones: ZoneType[] = [];

    if (campaign?.cityId) {
      zones = await prisma.zone.findMany({ where: { cityId: campaign.cityId } });
    }

    if (campaign?.stateId) {
      const cities = (await prisma.city.findMany({ where: { stateId: campaign.stateId } })).map((city) => city.id);
      zones = await prisma.zone.findMany({ where: { cityId: { in: cities } } });
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

export async function getCampaignBasicInfo(campaignId: string) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    let zones: ZoneType[] = [];

    if (campaign?.cityId) {
      zones = await prisma.zone.findMany({ where: { cityId: campaign.cityId } });
    }

    if (campaign?.stateId) {
      const cities = (await prisma.city.findMany({ where: { stateId: campaign.stateId } })).map((city) => city.id);
      zones = await prisma.zone.findMany({ where: { cityId: { in: cities } } });
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

export async function listSupporters(
  userId: string,
  campaignId: string,
  pagination?: { take?: number; skip?: number; dateFrom?: string }
) {
  const level = await verifyPermission(userId, campaignId);
  const allowedLevels = Array.from({ length: level - 1 }, (v, i) => i + 1);

  const supporters = await prisma.supporter.findMany({
    where: {
      campaignId,
      assignedAt: { gte: pagination?.dateFrom },
      OR: [
        { referralId: userId, level: { lt: level } },
        {
          referral: {
            supporter: {
              some: {
                AND: [{ level: { in: allowedLevels } }, { referralId: userId }],
              },
            },
          },
        },
      ],
    },
    orderBy: { assignedAt: "desc" },
    include: {
      user: { select: { name: true, email: true, info: { include: { Zone: true, Section: true } } } },
      referral: {
        select: { id: true, email: true, name: true, role: true, supporter: { where: { campaignId: campaignId } } },
      },
    },
    take: pagination?.take,
    skip: pagination?.skip,
  });
  if (!supporters.length)
    return await prisma.supporter.count({
      where: { campaignId: campaignId, assignedAt: { gte: pagination?.dateFrom } },
    });
  return supporters;
}

export async function generateMainPageStats(campaignId: string) {
  const totalSupporters = await prisma.supporter.count({ where: { campaignId: campaignId } });
  const supportersLastWeek = await prisma.supporter.count({
    where: {
      campaignId: campaignId,
      assignedAt: { lt: dayjs().subtract(1, "week").toISOString() },
    },
  });
  const mostFrequentReferral = await prisma.supporter.groupBy({
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

  let user;
  if (mostFrequentReferral && mostFrequentReferral.length > 0 && mostFrequentReferral[0].referralId) {
    user = await prisma.user.findUnique({
      where: {
        id: mostFrequentReferral[0].referralId,
      },
    });
  }
  return {
    totalSupporters,
    supportersLastWeek,
    referralLeader: { user: user, count: mostFrequentReferral[0]._count.referralId },
  };
}
