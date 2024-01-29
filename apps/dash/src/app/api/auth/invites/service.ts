import { isProd } from "@/_shared/utils/settings";
import dayjs from "dayjs";
import { prisma } from "prisma/prisma";

export async function createInviteCode({
  campaignId,
  referralId,
}: {
  campaignId: string;
  referralId: string;
}) {
  if (!campaignId || !referralId) throw "Missing campaignId or referralId";

  const existingCode = await prisma.inviteCode.findFirst({
    where: { campaignId, referralId },
  });

  if (
    existingCode &&
    dayjs(existingCode?.expiresAt).isAfter(dayjs().subtract(60, "minutes"))
  )
    return existingCode;

  const code = await prisma.inviteCode.create({
    data: {
      campaignId,
      referralId,
      expiresAt: dayjs()
        .add(isProd ? 60 : 200, "minutes")
        .toISOString(),
    },
  });

  return code;
}

export async function validateInviteCode(code: string) {
  const inviteCode = await prisma.inviteCode.findUnique({
    where: { id: code },
  });

  if (!inviteCode) throw "Código de convite inválido";

  if (dayjs(inviteCode.expiresAt).isBefore(dayjs()))
    throw "Código de convite expirado";

  await prisma.inviteCode.update({
    where: { id: code },
    data: { enteredAt: dayjs().toISOString() },
  });

  return inviteCode;
}

export async function useInviteCode(code: string) {
  const inviteCode = await prisma.inviteCode.findUnique({
    where: { id: code },
  });
  if (!inviteCode) throw "Código de convite inválido";
  if (dayjs(inviteCode.expiresAt).isBefore(dayjs()))
    throw "Código de convite expirado";
  if (inviteCode.submittedAt) throw "Código de convite expirado";

  const updatedInviteCode = await prisma.inviteCode.update({
    where: { id: code },
    data: { submittedAt: dayjs().toISOString() },
  });

  return updatedInviteCode;
}

export async function removeInvalidInviteCodes() {
  return await prisma.inviteCode.deleteMany({
    where: { expiresAt: { lte: dayjs().toISOString() } },
  });
}
