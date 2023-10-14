"use server";
import dayjs from "dayjs";
import prisma from "../../../common/utils/prisma";
import { NextResponse } from "next/server";
import { ZoneType } from "../../../common/types/locationTypes";
import { cookies, headers } from "next/headers";
import { Supporter, Zone } from "@prisma/client";
import { request } from "http";
import { getZonesByCity, getZonesByState } from "./zones";

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

export async function getCampaign(userId: string) {
  try {
    if (!cookies().get("activeCampaign")?.value) return;
    const campaign = await prisma.campaign.findUnique({
      where: {
        id: cookies().get("activeCampaign")?.value,
        supporters: { some: { userId: userId } },
      },
    });
    let zones: Zone[] = [];

    if (campaign?.cityId) {
      zones = await prisma.zone.findMany({
        where: { City_To_Zone: { some: { cityId: campaign.cityId } } },
      });
    }

    if (campaign?.stateId) {
      const cities = (
        await prisma.city.findMany({ where: { stateId: campaign.stateId } })
      ).map((city) => city.id);
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

    let zones;

    if (campaign?.cityId) {
      zones = await getZonesByCity(campaign?.cityId);
    }

    if (campaign?.stateId) {
      zones = await getZonesByState(campaign?.stateId);
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

export async function listSupporters({
  pagination = { pageSize: 10, pageIndex: 0 },
}: {
  pagination?: { pageSize: number; pageIndex: number };
}) {
  const userId = headers().get("userId");
  const campaignId = cookies().get("activeCampaign")?.value;

  if (!userId || !campaignId) return;
  const supporterAccount = await verifyPermission(userId, campaignId);

  function generateReferredObject(level: any): any {
    if (level === 1) {
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
            ...generateReferredObject(level - 1),
          },
        },
      };
    }
  }

  const includeReferred = generateReferredObject(supporterAccount.level - 1);

  const supporters: any[] = await prisma.supporter.findMany({
    where: {
      campaignId,
      referralId: supporterAccount.id,
    },
    include: {
      referral: { include: { user: { include: { info: true } } } },
      user: { include: { info: { include: { Section: true, Zone: true } } } },
      ...includeReferred,
    },
  });

  function flattenSupporters(supporters: any[]): any[] {
    const flatSupporters: any[] = [];
    supporters.forEach((supporter) => {
      if (supporter.referred) {
        flatSupporters.push(supporter);
        flatSupporters.push(...flattenSupporters(supporter.referred));
      } else {
        flatSupporters.push(supporter);
      }
    });
    return flatSupporters;
  }

  function paginationSlice(data: any[], pageIndex: number, pageSize: number) {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    const slicedList = data.slice(startIndex, endIndex);
    return slicedList;
  }

  const flatSupporters = flattenSupporters(supporters);

  return {
    supporters: paginationSlice(
      flatSupporters.sort((a, b) => b.assignedAt - a.assignedAt),
      pagination.pageIndex,
      pagination.pageSize
    ),
    meta: { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize },
    count: flatSupporters.length,
  };
}

export async function generateMainPageStats(
  userId: string,
  campaignId: string
) {
  await verifyPermission(userId, campaignId);
  const totalSupporters = await prisma.supporter.count({
    where: { campaignId: campaignId },
  });
  const supportersLastWeek = await prisma.supporter.count({
    where: {
      campaignId: campaignId,
      assignedAt: { lt: dayjs().subtract(1, "week").toISOString() },
    },
  });
  const mostFrequentReferralId = await prisma.supporter.groupBy({
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
    where: { id: mostFrequentReferralId[0].referralId! },
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

export async function fetchCampaignTeamMembers() {
  const userId = headers().get("userId");
  const campaignId = cookies().get("activeCampaign")?.value;

  if (!userId || !campaignId) return;
  const teamMembers = await prisma.supporter.findMany({
    where: { campaignId: campaignId, level: { gt: 1 } },
    include: {
      user: { include: { info: { include: { City: true, Zone: true } } } },
    },
  });
  return teamMembers;
}
