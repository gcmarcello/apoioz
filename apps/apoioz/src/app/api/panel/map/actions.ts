"use server";

import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import * as service from "./service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { ActionResponse } from "odinkit/api/ActionResponse";
import { revalidatePath } from "next/cache";

export async function createMapData() {
  try {
    const { request: parsedRequest } = await UseMiddlewares()
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

    const mapData = await service.createMapData(parsedRequest);
    return ActionResponse.success({ data: mapData });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function revalidateMapData() {
  revalidatePath("/painel/mapa");
}
