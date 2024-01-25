"use server";
import { cookies } from "next/headers";
import { prisma } from "prisma/prisma";
import { UserSessionMiddlewareReturnType } from "./userSession.middleware";

export async function CampaignLeaderMiddleware<T>({
  request,
}: UserSessionMiddlewareReturnType<T>) {
  const campaignId = cookies().get("activeCampaign")!.value;

  const supporter = await prisma.supporter.findFirst({
    where: {
      campaignId,
      userId: request.userSession.id,
    },
  });

  if (!supporter || supporter.level !== 4)
    throw "Você não tem permissão para acessar os dados dessa campanha.";

  return {
    request: {
      ...request,
      supporterSession: supporter,
    },
  };
}

export type SupporterSessionMiddlewareReturnType = Awaited<
  ReturnType<typeof CampaignLeaderMiddleware>
>;
