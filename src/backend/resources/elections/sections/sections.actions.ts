"use server";

import { LoginDto } from "@/(shared)/dto/schemas/auth/login";
import { User } from "@prisma/client";
import * as service from "./sections.service";

export async function getSectionsByZone(payload: string) {
  return service.getSectionsByZone(payload);
}
