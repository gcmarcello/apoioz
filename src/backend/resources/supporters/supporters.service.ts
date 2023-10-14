"use server";
import prisma from "@/backend/prisma/prisma";
import { listSupporters } from "../campaign/campaign.service";

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
