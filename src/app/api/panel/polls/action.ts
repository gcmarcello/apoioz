"use server";
import { cookies } from "next/headers";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { ActionResponse } from "../../_shared/utils/ActionResponse";
import * as service from "./service";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { CampaignLeaderMiddleware } from "@/middleware/functions/campaignLeader.middleware";
import { revalidatePath } from "next/cache";
import { PollAnswerDto, UpsertPollDto } from "./dto";
import { IpMiddleware } from "@/middleware/functions/ip.middleware";
import { readSupporterFromUser } from "../supporters/service";
import { getEnv } from "@/_shared/utils/settings";

export async function createPoll(request: UpsertPollDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware)
      .then(CampaignLeaderMiddleware);

    const poll = await service.createPoll(parsedRequest);
    revalidatePath("/painel/pesquisas");
    return ActionResponse.success({ data: poll });
  } catch (error) {
    return ActionResponse.error(error);
  }
}

export async function updatePoll(request: UpsertPollDto) {
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

export async function answerPoll(request: PollAnswerDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request).then(IpMiddleware);

    const token = cookies().get("token")?.value;
    if (token) {
      const url = getEnv("NEXT_PUBLIC_SITE_URL");
      const user = await fetch(`${url}/api/auth/verify`, {
        headers: { Authorization: token },
      })
        .then((res) => res.json())
        .catch((error) => ActionResponse.error(error));

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
    }

    const pollAnswer = await service.answerPoll(parsedRequest);
    return ActionResponse.success({ data: pollAnswer });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}
