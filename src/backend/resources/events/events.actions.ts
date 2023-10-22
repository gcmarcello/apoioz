"use server";

import { LoginDto } from "@/(shared)/dto/schemas/auth/login";
import { User } from "@prisma/client";
import * as service from "./events.service";
import { CreateEventDto } from "@/(shared)/dto/schemas/events/event";

class EventsActions {
  async createEvent(payload: CreateEventDto) {
    return service.createEvent(payload);
  }

  async getEventsByCampaign(payload: string) {
    return service.getEventsByCampaign(payload);
  }
}
export const { createEvent, getEventsByCampaign } = new EventsActions();
