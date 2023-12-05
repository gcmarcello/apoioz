"use server";
import { Supporter, User } from "@prisma/client";
import { MiddlewareArguments } from "@/middleware/types/types";
import { CreateSupportersDto, ReadSupportersDto } from "./dto";
import prisma from "prisma/prisma";

export async function ReadSupportersMiddleware({
  request,
}: MiddlewareArguments<
  ReadSupportersDto & { supporterSession: Supporter; userSession: Omit<User, "password"> }
>) {
  if (request.where) {
    const supporterSessionGroup = await prisma.supporterGroupMembership.findFirst({
      where: { AND: [{ supporterId: request.supporterSession.id }, { isOwner: true }] },
    });
    const supporter = await prisma.supporter.findFirst({
      where: {
        campaignId: request.supporterSession.campaignId,
        userId: request.where?.user.id,
      },
    });
    const ownerIdMembership = await prisma.supporterGroupMembership.findFirst({
      where: {
        AND: [
          { supporterGroupId: supporterSessionGroup?.supporterGroupId },
          { supporterId: supporter.id },
        ],
      },
    });

    if (!ownerIdMembership) throw "Você não tem permissão para acessar este apoiador.";
  }

  return {
    request,
  };
}

export async function CreateSupportersLevelMiddleware({
  request,
}: MiddlewareArguments<
  CreateSupportersDto & {
    supporterSession: Supporter;
    userSession: Omit<User, "password">;
  }
>) {
  /* const { supporterSession, userSession, ...rest } = request;

  const referral = supporterSession;
  const supporter = rest;

  if (referral.level <= supporter.level)
    throw "Você não pode adicionar um apoiador com o mesmo nível ou superior ao seu."; */

  return request;
}
