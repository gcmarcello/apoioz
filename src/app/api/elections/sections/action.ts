"use server";

import { ActionResponse } from "../../_shared/utils/ActionResponse";
import * as service from "./service";

export async function getSectionsByZone(zoneId: string) {
  try {
    const sections = await service.getSectionsByZone(zoneId);
    return ActionResponse.success({ data: sections });
  } catch (err) {
    return ActionResponse.error(err);
  }
}
