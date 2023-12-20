"use server";
import { Supporter } from "@prisma/client";
import { MiddlewareArguments } from "../types/types";
import { prisma } from "prisma/prisma";
import { SupporterSessionMiddlewareReturnType } from "./supporterSession.middleware";

export async function CampaignMiddleware<T>({
  request,
}: SupporterSessionMiddlewareReturnType<T>) {
  const campaign = await prisma.campaign.findFirst({
    where: {
      id: request.supporterSession.campaignId,
    },
  });

  return {
    request: {
      ...request,
      campaign,
    },
  };
}
