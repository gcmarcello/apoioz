"use server";

import { ActionResponse } from "odinkit";
import * as service from "./service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";

export async function readSectionsByZone(zoneId?: string | string[]) {
  try {
    if (!zoneId) throw "zoneId is required";
    const sections = await service.readSectionsByZone(zoneId);
    return ActionResponse.success({ data: sections });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function readSectionsByAddress(addressId: string) {
  const { request: parsedRequest } = await UseMiddlewares({
    request: { addressId },
  })
    .then(UserSessionMiddleware)
    .then(SupporterSessionMiddleware);

  try {
    const sections = await service.readSectionsByAddress(
      addressId,
      parsedRequest.supporterSession.campaignId
    );
    return ActionResponse.success({ data: sections });
  } catch (err) {
    return ActionResponse.error(err);
  }
}
