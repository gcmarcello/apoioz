"use server";

import { LoginDto } from "@/(shared)/dto/schemas/auth/login";
import { User } from "@prisma/client";
import { Bind } from "../../../../next_decorators/utils/functions/bindToPayload";
import * as service from "./locations.service";

class LocationsActions {
  async getCities(data) {
    return service.getCities(data);
  }
}
export const { getCities } = new LocationsActions();
