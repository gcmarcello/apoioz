"use server";

import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import * as service from "./service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { ActionResponse } from "../../_shared/utils/ActionResponse";

export async function generateMapData() {
  try {
    const { request: parsedRequest } = await UseMiddlewares()
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

    const mapData = await service.generateMapData(
      parsedRequest.supporterSession.campaignId
    );

    return ActionResponse.success({ data: mapData });
  } catch (err) {
    return ActionResponse.error(err);
  }
}
