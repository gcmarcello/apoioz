"use server";

import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import * as service from "./service";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { revalidatePath } from "next/cache";

export async function getUser(userId: string) {
  return service.getUser(userId);
}

export async function getUserFromSupporter(supporterId: string) {
  return service.getUserFromSupporter(supporterId);
}

export async function updateUser(request) {
  const parsedRequest = await UserSessionMiddleware({ request }).then((request) =>
    SupporterSessionMiddleware({ request })
  );
  revalidatePath("/painel/configuracoes");
  return service.updateUser(parsedRequest);
}
