"use server";

import { cookies, headers } from "next/headers";
import * as service from "./service";

export async function deactivateCampaign() {
  return cookies().delete("activeCampaign");
}

export async function activateCampaign(campaignId: string) {
  return cookies().set("activeCampaign", campaignId);
}

export async function listCampaigns(userId: string) {
  return service.listCampaigns(userId);
}

export async function getCampaign(request: { userId: string; campaignId: string }) {
  return service.getCampaign(request);
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
