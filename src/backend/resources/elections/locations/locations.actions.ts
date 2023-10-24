"use server";

import * as service from "./locations.service";

export async function getCitiesByState(data: string) {
  return service.getCitiesByState(data);
}
