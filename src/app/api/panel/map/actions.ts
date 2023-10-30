"use server";

import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import * as service from "./service";

export async function generateMapData(request = {}) {
  const parsedRequest = await UserSessionMiddleware({ request }).then((request) =>
    SupporterSessionMiddleware({ request })
  );
  return await service.generateMapData(parsedRequest.supporterSession.campaignId);
}
