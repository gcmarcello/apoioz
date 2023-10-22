"use server";

import { LoginDto } from "@/(shared)/dto/schemas/auth/login";
import { User } from "@prisma/client";
import * as service from "./events.service";

class EventsActions {
  async createEvent(payload) {
    return service.createEvent(payload);
  }

  async getEventsByCampaign(payload) {
    return service.getEventsByCampaign(payload);
  }
}
export const { createEvent, getEventsByCampaign } = new EventsActions();
