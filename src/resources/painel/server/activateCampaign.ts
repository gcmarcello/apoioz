"use server";

import { cookies } from "next/headers";
import { getCampaign } from "../../api/services/campaign";

export async function activateCampaign(campaignId: string, userId: string) {
  cookies().set("activeCampaign", campaignId);
  return await getCampaign(userId);
}

export async function deactivateCampaign() {
  cookies().delete("activeCampaign");
}
