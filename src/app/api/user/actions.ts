"use server";

import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import * as service from "./service";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { revalidatePath } from "next/cache";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { ActionResponse } from "../_shared/utils/ActionResponse";

export async function readUser(userId: string) {
  return service.readUser(userId);
}

export async function readUserFromSupporter(supporterId: string) {
  return service.readUserFromSupporter(supporterId);
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
