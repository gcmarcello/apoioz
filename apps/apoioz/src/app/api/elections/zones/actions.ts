"use server";

import { ActionResponse } from "odinkit/api/ActionResponse";
import * as service from "./service";

export async function readZonesByCity(payload: string) {
  try {
    const zones = await service.readZonesByCity(payload);
    return ActionResponse.success({
      data: zones,
    });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function readZonesByCampaign(payload: string) {
  try {
    const zones = await service.readZonesByCampaign(payload);
    return ActionResponse.success({ data: zones });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function readZonesByState(payload: string) {
  return service.readZonesByState(payload);
}
