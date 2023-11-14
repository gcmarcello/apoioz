"use server";

import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import * as service from "./service";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { revalidatePath } from "next/cache";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { ActionResponse } from "../_shared/utils/ActionResponse";

export async function getUser(userId: string) {
  return service.getUser(userId);
}

export async function getUserFromSupporter(supporterId: string) {
  return service.getUserFromSupporter(supporterId);
}

export async function updateUser(request) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

    revalidatePath("/painel/configuracoes");

    const updatedUser = await service.updateUser(parsedRequest);

    return ActionResponse.success({
      data: updatedUser,
    });
  } catch (err) {
    return ActionResponse.error(err);
  }
}
