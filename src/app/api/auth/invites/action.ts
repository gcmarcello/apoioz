"use server";
import * as services from "./service";

export async function createInviteCode({ campaignId, referralId }) {
  return await services.createInviteCode({ campaignId, referralId });
}

export async function validateInviteCode(code: string) {
  return await services.validateInviteCode(code);
}

export async function useInviteCode(code: string) {
  return await services.useInviteCode(code);
}
