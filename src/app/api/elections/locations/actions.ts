"use server";

import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import * as service from "./service";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";

export async function getCitiesByState(data: string) {
  return service.getCitiesByState(data);
}

export async function getAddressBySection(sectionId: string) {
  const address = await service.findAddressBySection(sectionId);
  return address;
}

export async function getAddressesByCampaign(request = {}) {
  const parsedRequest = await UserSessionMiddleware({ request }).then((request) =>
    SupporterSessionMiddleware({ request })
  );
  return await service.getAddressesByCampaign(parsedRequest.supporterSession.campaignId);
}
