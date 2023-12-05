"use server";

import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { readSupporterFromUser } from "../supporters/service";
import { CreateEventDto, ReadEventsAvailability, ReadEventsByCampaignDto } from "./dto";
import * as service from "./service";
import { ActionResponse } from "../../_shared/utils/ActionResponse";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";

export async function createEvent(request: CreateEventDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

    revalidatePath("/painel/calendario");

    const event = await service.createEvent(parsedRequest);

    return ActionResponse.success({
      data: event,
    });
  } catch (err) {
    ActionResponse.error(err);
  }
}

export async function readEventsByCampaign(payload: string) {
  return service.readEventsByCampaign();
}

export async function readEventTimestamps(payload: string) {
  return service.readEventTimestamps(payload);
}

export async function readEventsAvailability(request: ReadEventsAvailability) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then((res) => UserSessionMiddleware(res))
      .then((res) => SupporterSessionMiddleware(res));

    const eventsAvailability = await service.readEventsAvailability(parsedRequest);
    return ActionResponse.success({
      data: eventsAvailability,
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
