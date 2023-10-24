"use server";

import { LoginDto } from "@/(shared)/dto/schemas/auth/login";
import { Event, User } from "@prisma/client";
import * as service from "./events.service";
import { CreateEventDto } from "@/(shared)/dto/schemas/events/event";
import { cookies, headers } from "next/headers";
import { UseMiddlewares } from "@/next_decorators/lib/decorators/UseMiddlewares";
import { getSupporterByUser } from "../supporters/supporters.service";

class EventsActions {
  async createEvent(payload: CreateEventDto) {
    const campaignId = cookies().get("activeCampaign")?.value;
    if (!campaignId) throw new Error("Erro ao criar evento");
    const supporter = await getSupporterByUser({
      userId: payload.userId,
      campaignId: campaignId,
    });

    return service.createEvent({ ...payload, hostId: supporter?.id, campaignId });
  }

  async getEventsByCampaign(payload: string) {
    const userId = headers().get("userId");
    if (!userId) throw new Error("Usuário não encontrado");
    return service.getEventsByCampaign({ userId, campaignId: payload });
  }

  async getAvailableTimesByDay(payload: { campaignId: string; day: string }) {
    return await service.getAvailableTimesByDay(payload.campaignId, payload.day);
  }

  async updateEventStatus(payload: { eventId: string; status: string }) {
    return await service.updateEventStatus({
      eventId: payload.eventId,
      status: payload.status,
    });
  }

  async updateEvent(payload: { eventId: string; data: Event }) {
    return await service.updateEvent({
      eventId: payload.eventId,
      data: payload.data,
    });
  }
}
export const { createEvent, getEventsByCampaign, getAvailableTimesByDay } =
  new EventsActions();
