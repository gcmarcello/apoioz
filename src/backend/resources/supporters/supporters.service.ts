"use server";
import prisma from "@/backend/prisma/prisma";
import {
  findCampaignById,
  listSupporters,
  verifyPermission,
} from "../campaign/campaign.service";
import { NewUserType } from "@/shared/types/userTypes";
import { cookies, headers } from "next/headers";
import { handlePrismaError } from "@/backend/prisma/prismaError";
import { normalizePhone } from "@/shared/utils/format";
import { Campaign, User, UserInfo } from "@prisma/client";
import { verifyExistingUser } from "../users/users.service";
import dayjs from "dayjs";

export async function getSupporterByUser(userId: string, campaignId: string) {
  const supporter = await prisma.supporter.findFirst({
    where: { userId, campaignId },
  });
  if (supporter) return supporter;
}

export async function getLatestSupporters(
  userId: string,
  campaignId: string
): Promise<any> {
  const latestSupporters = await listSupporters({
    pagination: { pageIndex: 0, pageSize: 5 },
  });

  if (latestSupporters) return latestSupporters.supporters;
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
  if (conflictingSupporter) {
    throw new Error("Usuário já cadastrado em outra campanha do mesmo tipo");
  }
}

export async function findSupporterGroup(supporterId: string) {
  return await prisma.supporter_to_SupporterGroup.findFirst({
    where: { supporterId },
  });
}

export async function createSupporter(data: any) {
  try {
    const { name, email, password, campaign, ...info } = data;
    const checkForExistingUser = await verifyExistingUser(info.phone);
    const campaignToBe = await findCampaignById(campaign.campaignId);

    if (!campaignToBe) throw new Error("Campanha não encontrada");
    if (checkForExistingUser) {
      await verifyConflictingSupporter(campaignToBe, checkForExistingUser);
    }

    const supporterGroup = await findSupporterGroup(campaign.referralId);
    console.log(campaign.referralId);
    if (!supporterGroup) throw new Error("Grupo de apoiadores não encontrado");

    const supporterGroupId = crypto.randomUUID();
    const newSupporterGroup = await prisma.supporterGroup.create({
      data: { id: supporterGroupId },
    });

    return await prisma.supporter.create({
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
        SupporterGroup: { connect: { id: supporterGroupId } },
        Supporter_to_SupporterGroup: {
          createMany: {
            data: [
              { supporterGroupId, isOwner: true },
              {
                supporterGroupId: supporterGroup.supporterGroupId,
                isOwner: false,
              },
            ],
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    return handlePrismaError("usuário", error);
  }
}

export async function getSupporters({
  pagination = { pageSize: 10, pageIndex: 0 },
  meta,
}: {
  pagination?: { pageSize: number; pageIndex: number };
  meta?: { campaignId: string };
}) {
  const userId = headers().get("userId");
  const campaignId = meta?.campaignId || cookies().get("activeCampaign")?.value;

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
