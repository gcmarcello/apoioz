"use server";

import { LoginDto } from "@/backend/dto/schemas/auth/login";
import { User } from "@prisma/client";
import * as service from "./sections.service";

export async function getSectionsByZone(zoneId: string) {
  return service.getSectionsByZone(zoneId);
}
