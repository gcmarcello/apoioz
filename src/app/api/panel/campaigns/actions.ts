"use server";

import { cookies, headers } from "next/headers";
import * as service from "./service";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { ActionResponse } from "../../_shared/utils/ActionResponse";
import { CampaignLeaderMiddleware } from "@/middleware/functions/campaignLeader.middleware";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deactivateCampaign() {
  cookies().delete("activeCampaign");
  return redirect("/painel");
}

export async function activateCampaign(campaignId: string) {
  cookies().set("activeCampaign", campaignId);
}

export async function listCampaigns(userId: string) {
  return service.listCampaigns(userId);
}

export async function readCampaign(request: { campaignId: string }) {
  return service.readCampaign(request);
}

export async function updateCampaign(request: { campaignId: string; data: any }) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware)
      .then(CampaignLeaderMiddleware);

    const updatedCampaign = await service.updateCampaign(parsedRequest);
    revalidatePath("/painel/configuracoes");

    return ActionResponse.success({
      data: updatedCampaign,
      message: "Campanha atualizada com sucesso!",
    });
  } catch (err) {
    console.log(err);
    return ActionResponse.error(err);
  }
}

export async function fetchCampaignTeamMembers() {
  const userId = headers().get("userId");
  const campaignId = cookies().get("activeCampaign")?.value;

  if (!userId || !campaignId) return;

  return service.readCampaignTeamMembers(campaignId);
}

export async function generateMainPageStats(data: any) {
  return service.generateMainPageStats(data);
}

export async function createCampaign(data: any) {
  return service.createCampaign(data);
}
