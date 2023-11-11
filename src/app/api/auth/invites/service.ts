import dayjs from "dayjs";
import prisma from "prisma/prisma";

export async function createInviteCode({ campaignId, referralId }) {
  if (!campaignId || !referralId) throw "Missing campaignId or referralId";

  const code = await prisma.inviteCode.create({
    data: { campaignId, referralId, expiresAt: dayjs().add(10, "minutes").toISOString() },
  });

  return code;
}

export async function validateInviteCode(code: string) {
  const inviteCode = await prisma.inviteCode.findUnique({ where: { id: code } });

  if (dayjs(inviteCode.expiresAt).isBefore(dayjs())) throw "Código de convite expirado";

  await prisma.inviteCode.update({
    where: { id: code },
    data: { enteredAt: dayjs().toISOString() },
  });

  return inviteCode;
}

export async function useInviteCode(code: string) {
  const inviteCode = await prisma.inviteCode.findUnique({ where: { id: code } });
  if (dayjs(inviteCode.expiresAt).isBefore(dayjs())) throw "Código de convite expirado";
  if (inviteCode.submittedAt) throw "Código de convite expirado";

  const updatedInviteCode = await prisma.inviteCode.update({
    where: { id: code },
    data: { submittedAt: dayjs().toISOString() },
  });

  return updatedInviteCode;
}

export async function removeInvalidInviteCodes() {
  const codes = await prisma.inviteCode.findMany({
    where: { expiresAt: { lte: dayjs().toISOString() } },
  });

  await prisma.inviteCode.deleteMany({
    where: { id: { in: codes.map((code) => code.id) } },
  });
}
