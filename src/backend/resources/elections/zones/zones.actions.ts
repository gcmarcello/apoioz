"use server";

import { LoginDto } from "@/(shared)/dto/schemas/auth/login";
import { User } from "@prisma/client";
import * as service from "./zones.service";

class ZonesActions {
  async getZonesByCity(payload) {
    return service.getZonesByCity(payload);
  }

  async getZonesByState(payload) {
    return service.getZonesByState(payload);
  }
}
export const { getZonesByCity, getZonesByState } = new ZonesActions();
