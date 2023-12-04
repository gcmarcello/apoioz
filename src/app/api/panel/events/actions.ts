"use server";

import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { getSupporterByUser } from "../supporters/service";
import {
  CreateEventDto,
  ReadAvailableTimesByDayDto,
  ReadEventsByCampaignDto,
} from "./dto";
import * as service from "./service";
import { ActionResponse } from "../../_shared/utils/ActionResponse";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";

export async function createEvent(payload: CreateEventDto) {
  const campaignId = cookies().get("activeCampaign")?.value;
  if (!campaignId) throw new Error("Erro ao criar evento");
  const supporter = await getSupporterByUser({
    userId: payload.userId,
    campaignId: campaignId,
  });

  revalidatePath("/painel/calendario");

  return service.createEvent({
    ...payload,
    hostId: supporter?.id,
    campaignId,
  });
}

export async function getEventsByCampaign(payload: string) {
  const userId = headers().get("userId");
  if (!userId) throw new Error("Usuário não encontrado");
  return service.getEventsByCampaign({ userId, campaignId: payload });
}

export async function getEventTimestamps(payload: string) {
  return service.getEventTimestamps(payload);
}

export async function readAvailableTimesByDay(request: ReadAvailableTimesByDayDto) {
  try {
    const {
      request: {
        supporterSession: { campaignId },
        where: { day },
      },
    } = await UseMiddlewares(request)
      .then((res) => UserSessionMiddleware(res))
      .then((res) => SupporterSessionMiddleware(res));

    const availableTimes = await service.getAvailableTimesByDay(campaignId, day);
    return ActionResponse.success({
      data: availableTimes,
    });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function updateEventStatus(request: { eventId: string; status: string }) {
  const parsedRequest = await UserSessionMiddleware({ request }).then((request) =>
    SupporterSessionMiddleware(request)
  );

  await service.updateEventStatus(parsedRequest.request);
  return revalidatePath("/painel/calendario");
}

export async function updateEvent(payload: { eventId: string; data: Event }) {
  return await service.updateEvent({
    eventId: payload.eventId,
    data: payload.data,
  });
}
