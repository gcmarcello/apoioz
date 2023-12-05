"use server";

import { ActionResponse } from "../../_shared/utils/ActionResponse";
import * as service from "./service";

export async function readSectionsByZone(zoneId: string) {
  try {
    const sections = await service.readSectionsByZone(zoneId);
    return ActionResponse.success({ data: sections });
  } catch (err) {
    return ActionResponse.error(err);
  }
}
