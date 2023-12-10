"use server";
import { cookies, headers } from "next/headers";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { ActionResponse } from "../../_shared/utils/ActionResponse";
import * as service from "./service";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { CampaignLeaderMiddleware } from "@/middleware/functions/campaignLeader.middleware";
import { revalidatePath } from "next/cache";
import { PollAnswerDto, UpsertPollDto } from "./dto";
import { IpMiddleware } from "@/middleware/functions/ip.middleware";
import { AuthMiddleware } from "@/middleware/functions/auth.middleware";
import { readSupporterFromUser } from "../supporters/service";

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
    return ActionResponse.error(error);
  }
}

export async function readActivePoll(request) {
  const poll = await service.readActivePoll(request);
}

export async function answerPoll(request: PollAnswerDto) {
  const { request: parsedRequest } = await UseMiddlewares(request).then(IpMiddleware);

  const token = cookies().get("token")?.value;
  if (!token) return false;
  const url = process.env.SITE_URL;
  const user = await fetch(`${url}/api/auth/verify`, {
    headers: { Authorization: token },
  }).then((res) => res.json());

  if (user) {
    const poll = await service.readPoll({ id: parsedRequest.pollId });
    if (!poll) throw new Error("Pesquisa não encontrada");
    const supporter = await readSupporterFromUser({
      userId: user.id,
      campaignId: poll.campaignId,
    });

    if (supporter) {
      for (const question of parsedRequest.questions) {
        question.supporterId = supporter.id;
      }
    }
  }
  try {
    const pollAnswer = await service.answerPoll(parsedRequest);
    return ActionResponse.success({ data: pollAnswer });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}
