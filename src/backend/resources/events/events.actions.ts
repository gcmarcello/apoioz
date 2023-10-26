"use server";

import { LoginDto } from "@/backend/dto/schemas/auth/login";
import * as service from "./events.service";
import type { CreateEventDto } from "@/backend/dto/schemas/events/event";
import { cookies, headers } from "next/headers";
import { getSupporterByUser } from "../supporters/supporters.service";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { _NextResponse } from "@/(shared)/utils/http/_NextResponse";
import type { Supporter, User } from "@prisma/client";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";

export async function createEvent(payload: CreateEventDto) {
  const campaignId = cookies().get("activeCampaign")?.value;
  if (!campaignId) throw new Error("Erro ao criar evento");
  const supporter = await getSupporterByUser({
    userId: payload.userId,
    campaignId: campaignId,
  });

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

  return await service.updateEventStatus(parsedRequest);
}

export async function updateEvent(payload: { eventId: string; data: Event }) {
  return await service.updateEvent({
    eventId: payload.eventId,
    data: payload.data,
  });
}
