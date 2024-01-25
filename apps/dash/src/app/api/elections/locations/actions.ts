"use server";

import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import * as service from "./service";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { ActionResponse } from "odinkit";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";

export async function readCitiesByState(data: string) {
  try {
    const cities = await service.readCitiesByState(data);
    return ActionResponse.success({
      data: cities,
    });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function readStates() {
  return await service.readStates();
}

export async function readAddressBySection(sectionId: string) {
  try {
    const addressFromSection = await service.readAddressBySection(sectionId);
    return ActionResponse.success({ data: addressFromSection });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function readAddressesByCampaign() {
  try {
    const { request: parsedRequest } = await UseMiddlewares()
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

    const addressesFromCampaign = await service.readAddressesByCampaign(
      parsedRequest.supporterSession.campaignId
    );

    return ActionResponse.success({ data: addressesFromCampaign });
  } catch (err) {
    return ActionResponse.error(err);
  }
}
