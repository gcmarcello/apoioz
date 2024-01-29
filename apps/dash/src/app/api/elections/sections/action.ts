"use server";

import { ActionResponse } from "odinkit";
import * as service from "./service";

export async function readSectionsByZone(zoneId: string) {
  try {
    if (!zoneId) throw "zoneId is required";
    const sections = await service.readSectionsByZone(zoneId);
    return ActionResponse.success({ data: sections });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function readSectionsByAddress(addressId: string) {
  try {
    const sections = await service.readSectionsByAddress(addressId);
    return ActionResponse.success({ data: sections });
  } catch (err) {
    return ActionResponse.error(err);
  }
}
