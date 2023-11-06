"use server";

import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { getSupporterByUser } from "../supporters/service";
import { CreateEventDto } from "./dto";
import * as service from "./service";

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

export async function getAvailableTimesByDay(payload: {
  campaignId: string;
  day: string;
}) {
  return await service.getAvailableTimesByDay(payload.campaignId, payload.day);
}

export async function updateEventStatus(request: { eventId: string; status: string }) {
  const parsedRequest = await UserSessionMiddleware({ request }).then((request) =>
    SupporterSessionMiddleware({ request })
  );
  revalidatePath("/painel/calendario");
  return await service.updateEventStatus(parsedRequest);
}

export async function updateEvent(payload: { eventId: string; data: Event }) {
  return await service.updateEvent({
    eventId: payload.eventId,
    data: payload.data,
  });
}
