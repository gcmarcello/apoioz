"use server";
import { prisma } from "prisma/prisma";
import { SupporterSessionMiddlewareReturn } from "./supporterSession.middleware";

export async function CampaignMiddleware<R, A>({
  request,
}: SupporterSessionMiddlewareReturn<R, A>) {
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
