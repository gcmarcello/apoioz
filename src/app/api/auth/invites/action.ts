"use server";
import { ActionResponse } from "../../_shared/utils/ActionResponse";
import * as services from "./service";

export async function createInviteCode({ campaignId, referralId }) {
  try {
    const inviteCode = await services.createInviteCode({ campaignId, referralId });

    return inviteCode;
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
