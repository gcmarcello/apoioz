"use server";

import * as service from "./locations.service";

export async function getCitiesByState(data: string) {
  return service.getCitiesByState(data);
}

export async function getAddressBySection(sectionId: string) {
  const address = await service.findAddressBySection(sectionId);
  console.log(address);
  return address;
}
