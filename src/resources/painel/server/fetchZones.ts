"use server";
import { ZoneType } from "../../../common/types/locationTypes";
import { getZones } from "../../api/services/locations";

export async function getCampaignZones(campaign: any): Promise<ZoneType[] | undefined> {
  return await getZones({ cityId: campaign.cityId });
}
