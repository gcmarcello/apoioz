"use server";

import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import * as service from "./service";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { ActionResponse } from "../../_shared/utils/ActionResponse";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";

export async function getCitiesByState(data: string) {
  try {
    const cities = await service.getCitiesByState(data);
    return ActionResponse.success({
      data: cities,
    });
  } catch (err) {
    ActionResponse.error(err);
  }
}

export async function getStates() {
  return await service.getStates();
}

export async function getAddressBySection(sectionId: string) {
  try {
    const addressFromSection = await service.findAddressBySection(sectionId);
    return ActionResponse.success({ data: addressFromSection });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function getAddressesByCampaign() {
  try {
    const { request: parsedRequest } = await UseMiddlewares()
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

    const addressesFromCampaign = await service.getAddressesByCampaign(
      parsedRequest.supporterSession.campaignId
    );

    return ActionResponse.success({ data: addressesFromCampaign });
  } catch (err) {
    return ActionResponse.error(err);
  }
}
