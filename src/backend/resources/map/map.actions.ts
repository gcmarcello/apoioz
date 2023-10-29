"use server";

import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import * as service from "./map.service";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";

export async function generateMapData(request = {}) {
  const parsedRequest = await UserSessionMiddleware({ request }).then((request) =>
    SupporterSessionMiddleware({ request })
  );
  return await service.generateMapData(parsedRequest.supporterSession.campaignId);
}
