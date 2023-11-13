"use server";

import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import * as service from "./service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";

export async function generateMapData(request = {}) {
  const { request: parsedRequest } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(SupporterSessionMiddleware);
  return await service.generateMapData(parsedRequest.supporterSession.campaignId);
}
