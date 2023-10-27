"use server";

import * as service from "./sections.service";

export async function getSectionsByZone(zoneId: string) {
  const sections = await service.getSectionsByZone(zoneId);
  return sections;
}
