import dayjs from "dayjs";
import { InviteCode } from "prisma/client";
import { prisma } from "prisma/prisma";

export async function createInviteCode({
  campaignId,
  referralId,
  override = false,
}: {
  override?: boolean;
  campaignId: string;
  referralId: string;
}) {
  if (!campaignId || !referralId) throw "Missing campaignId or referralId";

  const lastInviteCode = await getLastInviteCode({
    referralId,
    campaignId,
  });

  if (!override && lastInviteCode) {
    const isCodeValid = validateInviteCode(lastInviteCode);

    if (isCodeValid) return lastInviteCode;
  }

  const code = await prisma.inviteCode.create({
    data: {
      campaignId,
      referralId,
      expiresAt: dayjs().add(60, "minutes").toISOString(),
    },
  });

  return code;
}

export async function readInviteCode({ id }: { id: string }) {
  return await prisma.inviteCode.findUnique({
    where: { id },
  });
}

export async function getLastInviteCode({
  referralId,
  campaignId,
}: {
  referralId: string;
  campaignId: string;
}) {
  return await prisma.inviteCode.findFirst({
    where: { referralId, campaignId },
    orderBy: { expiresAt: "desc" },
  });
}

export function validateInviteCode(code: InviteCode) {
  const expiresAt = dayjs(code.expiresAt);

  const now = dayjs();

  return dayjs(now).isAfter(expiresAt);
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
