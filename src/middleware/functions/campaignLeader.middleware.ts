"use server";
import { User } from "@prisma/client";
import { cookies } from "next/headers";
import prisma from "prisma/prisma";
import { MiddlewareArguments } from "../types/types";
import { UserSessionMiddlewareReturnType } from "./userSession.middleware";

export async function CampaignLeaderMiddleware({
  request,
}: UserSessionMiddlewareReturnType) {
  const campaignId = cookies().get("activeCampaign")!.value;

  const supporter = await prisma.supporter.findFirst({
    where: {
      campaignId,
      userId: request.userSession.id,
    },
  });

  if (supporter.level !== 4)
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
