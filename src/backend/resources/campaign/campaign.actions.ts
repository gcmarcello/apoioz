"use server";

import * as service from "./campaign.service";

class CampaignActions {
  async getCampaign(payload: string) {
    return service.getCampaign(payload);
  }

  async fetchCampaignTeamMembers() {
    return service.fetchCampaignTeamMembers();
  }

  async generateMainPageStats(data: any) {
    return service.generateMainPageStats(data);
  }

  async deactivateCampaign() {
    return service.deactivateCampaign();
  }

  async createCampaign(data: any) {
    return service.createCampaign(data);
  }

  async activateCampaign(data: any) {
    return service.activateCampaign(data);
  }
}

export const {
  getCampaign,
  fetchCampaignTeamMembers,
  generateMainPageStats,
  deactivateCampaign,
  createCampaign,
  activateCampaign,
} = new CampaignActions();
