"use server";

import { cookies, headers } from "next/headers";
import * as service from "./service";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";

export async function deactivateCampaign() {
  return cookies().delete("activeCampaign");
}

export async function activateCampaign(campaignId: string) {
  return cookies().set("activeCampaign", campaignId);
}

export async function listCampaigns(userId: string) {
  return service.listCampaigns(userId);
}

export async function getCampaign(request: { campaignId: string }) {
  return service.getCampaign(request);
}

export async function updateCampaign(request: { campaignId: string; data: any }) {
  const parsedRequest = await UserSessionMiddleware({ request }).then((request) =>
    SupporterSessionMiddleware({ request })
  );

  if (parsedRequest.supporterSession.level !== 4)
    throw "Você não tem permissão para alterar esta campanha.";

  return await service.updateCampaign(request);
}

export async function fetchCampaignTeamMembers() {
  const userId = headers().get("userId");
  const campaignId = cookies().get("activeCampaign")?.value;

  if (!userId || !campaignId) return;

  return service.getCampaignTeamMembers(campaignId);
}

export async function generateMainPageStats(data: any) {
  return service.generateMainPageStats(data);
}

export async function createCampaign(data: any) {
  return service.createCampaign(data);
}
