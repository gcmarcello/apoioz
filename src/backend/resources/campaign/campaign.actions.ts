"use server";

import { cookies } from "next/headers";
import * as service from "./campaign.service";

class CampaignActions {
  async deactivateCampaign() {
    cookies().delete("activeCampaign");
  }

  async activateCampaign(campaignId: string) {
    return cookies().set("activeCampaign", campaignId);
  }

  async listCampaigns(userId: string) {
    return service.listCampaigns(userId);
  }

  async getCampaign({ userId, campaignId }: { userId: string; campaignId: string }) {
    return service.getCampaign({
      userId,
      campaignId: campaignId,
    });
  }

  async fetchCampaignTeamMembers() {
    return service.fetchCampaignTeamMembers();
  }

  async generateMainPageStats(data: any) {
    return service.generateMainPageStats(data);
  }

  async createCampaign(data: any) {
    return service.createCampaign(data);
  }
}

export const {
  deactivateCampaign,
  listCampaigns,
  getCampaign,
  fetchCampaignTeamMembers,
  generateMainPageStats,
  createCampaign,
  activateCampaign,
} = new CampaignActions();
