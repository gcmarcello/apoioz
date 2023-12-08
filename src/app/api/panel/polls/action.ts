"use server";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { ActionResponse } from "../../_shared/utils/ActionResponse";
import * as service from "./service";
import { UpsertPollDto } from "./dto";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { CampaignLeaderMiddleware } from "@/middleware/functions/campaignLeader.middleware";
import { revalidatePath } from "next/cache";

export async function createPoll(request: UpsertPollDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware)
      .then(CampaignLeaderMiddleware);

    const poll = await service.createPoll(parsedRequest);

    return ActionResponse.success({ data: poll });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}

export async function updatePoll(request) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware)
      .then(CampaignLeaderMiddleware);
    const poll = await service.updatePoll(parsedRequest);
    revalidatePath("/painel/pesquisas");

    return ActionResponse.success({ data: poll });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}

export async function readActivePoll(request) {
  const poll = await service.readActivePoll(request);
}
