import prisma from "../../common/utils/prisma";

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
    return await prisma.campaign.findMany({ where: { userId } });
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
      user: { select: { name: true, email: true, info: true } },
      referral: { include: { supporter: { where: { campaignId: campaignId } } } },
    },
    take: pagination?.take,
    skip: pagination?.skip,
  });
  if (!supporters.length) return await prisma.supporter.count();
  return supporters;
}
