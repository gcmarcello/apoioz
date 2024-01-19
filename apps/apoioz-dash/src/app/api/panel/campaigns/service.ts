import { Supporter, Zone } from "@prisma/client";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import crypto from "crypto";

import { prisma } from "prisma/prisma";
import {
  readZonesByCity,
  readZonesByState,
} from "../../elections/zones/actions";
import { readZonesByCampaign } from "../../elections/zones/service";
import { getEnv } from "@/_shared/utils/settings";
import { SupporterSession } from "@/middleware/functions/supporterSession.middleware";
import { CreateCampaignDto } from "./dto";
import { UserSession } from "@/middleware/functions/userSession.middleware";
import { zoneWithoutGeoJSON } from "prisma/query/Zone";

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
      where: {
        AND: [
          { slug: data.slug },
          { NOT: { id: supporterSession.campaignId } },
        ],
      },
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

export async function readCampaign(request: {
  campaignId?: string;
  slug?: string;
}) {
  const campaign = await prisma.campaign.findFirst({
    where: request.campaignId
      ? { id: request.campaignId }
      : { slug: request.slug },
    include: { city: { include: { State: true } }, state: true },
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

export async function generateMainPageStats(
  supporterSession: SupporterSession
) {
  const totalSupporters = await prisma.supporter.count({
    where: {
      campaignId: supporterSession.campaignId,
    },
  });

  const supportersLastWeek = await prisma.supporter.count({
    where: {
      campaignId: supporterSession.campaignId,
      createdAt: { lt: dayjs().subtract(1, "week").toISOString() },
    },
  });

  const referralLeaderCount = await prisma.supporter
    .groupBy({
      by: ["referralId"],
      where: {
        campaignId: supporterSession.campaignId,
      },
      _count: {
        referralId: true,
      },
      orderBy: {
        _count: {
          referralId: "desc",
        },
      },
    })
    .then((s) => s[0])
    .then((s) => ({
      id: s.referralId,
      count: s._count.referralId,
    }));

  const campaignLeader = await prisma.supporter.findFirst({
    where: {
      level: 4,
      campaignId: supporterSession.campaignId,
    },
  });

  const referralLeader = await prisma.supporter
    .findFirst({
      where: {
        id: referralLeaderCount.id || campaignLeader?.id,
      },
      include: {
        user: true,
      },
    })
    .then((r) => ({ ...r, count: referralLeaderCount.count }));

  const leadingSectionCount = await prisma.userInfo
    .groupBy({
      by: ["sectionId"],
      where: {
        user: {
          supporter: {
            some: {
              campaignId: supporterSession.campaignId,
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
    })
    .then((s) => s[0])
    .then((s) => ({
      id: s.sectionId,
      count: s._count.sectionId,
    }));

  if (!leadingSectionCount.id) throw "Seção não encontrada";

  const leadingSection = await prisma.section
    .findFirst({
      where: { id: leadingSectionCount.id },
      include: {
        Zone: zoneWithoutGeoJSON,
        Address: true,
      },
    })
    .then((r) => ({ ...r, count: leadingSectionCount.count }));

  if (!leadingSection) throw "Seção não encontrada";

  return {
    totalSupporters,
    supportersLastWeek,
    leadingSection,
    referralLeader,
  };
}

export async function readCampaignTeamMembers(campaignId: string) {
  const teamMembers = await prisma.supporter.findMany({
    where: { campaignId: campaignId, level: { gt: 1 } },
    include: {
      user: { include: { info: { include: { Zone: zoneWithoutGeoJSON } } } },
    },
  });

  return teamMembers;
}

export async function createCampaign({
  userSession,
  ...data
}: CreateCampaignDto & { userSession: UserSession }) {
  const supporterId = crypto.randomUUID();

  const campaign = await prisma.campaign.create({
    data: {
      name: data.name,
      slug: data.slug,
      type: data.type,
      year: data.year,
      userId: userSession.id,
      cityId: data.cityId,
      supporters: {
        create: {
          id: supporterId,
          userId: userSession.id,
          level: 4,
          SupporterGroup: {
            create: {
              memberships: {
                create: {
                  supporterId,
                },
              },
            },
          },
        },
      },
    },
    include: {
      supporters: true,
    },
  });

  return campaign;
}

export async function checkUserCanJoinCampaign({
  campaignId,
  userId,
}: {
  campaignId: string;
  userId: string;
}) {
  const campaign = await prisma.campaign.findFirst({
    where: {
      id: campaignId,
    },
  });

  if (!campaign) throw "Campanha não encontrada";

  const conflictingCampaignsIds: string[] = (
    await prisma.campaign.findMany({
      where: {
        AND: [
          { cityId: campaign.cityId },
          { type: campaign.type },
          { year: campaign.year },
        ],
      },
    })
  ).map((campaign) => campaign.id);

  const conflictingSupporter = await prisma.supporter.findFirst({
    where: {
      userId: userId,
      campaignId: { in: conflictingCampaignsIds },
    },
  });

  if (conflictingSupporter?.campaignId === campaign.id)
    return "Este email ou telefone já estão cadastrados nesta campanha.";

  if (conflictingSupporter)
    return "Este email ou telefone já estão cadastrados em outra campanha da mesma cidade, tipo e ano.";

  const userInfo = await prisma.userInfo.findFirst({
    where: { user: { id: userId } },
  });

  if (!userInfo) throw "Usuário não encontrado";

  const campaignZones = await readZonesByCampaign(campaignId);

  if (!campaignZones) throw "Campanha não encontrada";

  const userIsFromRegion = campaignZones.some(
    (zone) => zone.id === userInfo.zoneId
  );

  return userIsFromRegion
    ? "canJoin"
    : "Este usuário não é da região da campanha.";
}
