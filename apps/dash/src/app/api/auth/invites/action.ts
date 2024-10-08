"use server";

import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { ActionResponse } from "odinkit";
import * as services from "./service";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";

export async function createInviteCode(request?: { override?: boolean }) {
  try {
    const { request: parsedRequest } = await UseMiddlewares({ request })
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

    const inviteCode = await services.createInviteCode({
      campaignId: parsedRequest.supporterSession.campaignId,
      referralId: parsedRequest.supporterSession.id,
      override: parsedRequest.override,
    });

    return ActionResponse.success({
      data: inviteCode,
    });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function useInviteCode(code: string) {
  return await services.useInviteCode(code);
}
