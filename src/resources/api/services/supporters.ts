"use server";
import prisma from "../../../common/utils/prisma";

export async function getSupporterByUser(userId: string, campaignId: string) {
  const supporter = await prisma.supporter.findFirst({
    where: { userId, campaignId },
  });
  if (supporter) return supporter;
}
