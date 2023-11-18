"use server";

import { ActionResponse } from "../../_shared/utils/ActionResponse";
import * as service from "./service";

export async function getZonesByCity(payload: string) {
  try {
    const zones = await service.getZonesByCity(payload);
    return ActionResponse.success({
      data: zones,
    });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function getZonesByCampaign(payload: string) {
  try {
    const zones = await service.getZonesByCampaign(payload);
    return ActionResponse.success({ data: zones });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function getZonesByState(payload: string) {
  return service.getZonesByState(payload);
}
