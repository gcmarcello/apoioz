"use server";

import { LoginDto } from "@/backend/dto/schemas/auth/login";
import { User } from "@prisma/client";
import * as service from "./zones.service";

export async function getZonesByCity(payload: string) {
  return service.getZonesByCity(payload);
}

export async function getZonesByCampaign(payload: string) {
  return service.getZonesByCampaign(payload);
}

export async function getZonesByState(payload: string) {
  return service.getZonesByState(payload);
}
