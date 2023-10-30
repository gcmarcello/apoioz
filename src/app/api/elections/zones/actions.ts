"use server";

import * as service from "./service";

export async function getZonesByCity(payload: string) {
  return service.getZonesByCity(payload);
}

export async function getZonesByCampaign(payload: string) {
  const zones = await service.getZonesByCampaign(payload);
  console.log(zones);
  return zones;
}

export async function getZonesByState(payload: string) {
  return service.getZonesByState(payload);
}
