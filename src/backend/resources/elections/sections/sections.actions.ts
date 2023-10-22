"use server";

import { LoginDto } from "@/(shared)/dto/schemas/auth/login";
import { User } from "@prisma/client";
import * as service from "./sections.service";

class SectionActions {
  async getSectionsByZone(payload: string) {
    return service.getSectionsByZone(payload);
  }
}
export const { getSectionsByZone } = new SectionActions();
