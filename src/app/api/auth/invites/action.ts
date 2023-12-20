"use server";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { ActionResponse } from "../../_shared/utils/ActionResponse";
import * as services from "./service";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";

export async function createInviteCode() {
  try {
    const { request: parsedRequest } = await UseMiddlewares()
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

    const inviteCode = await services.createInviteCode({
      campaignId: parsedRequest.supporterSession.campaignId,
      referralId: parsedRequest.supporterSession.id,
    });

    return ActionResponse.success({
      data: inviteCode,
    });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function validateInviteCode(code: string) {
  return await services.validateInviteCode(code);
}

export async function useInviteCode(code: string) {
  return await services.useInviteCode(code);
}
