"use server";

import { cookies } from "next/headers";

export async function activateCampaign(campaignId: string) {
  cookies().set("activeCampaign", campaignId);
}

export async function deactivateCampaign() {
  cookies().delete("activeCampaign");
}
