"use server";

import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { revalidatePath } from "next/cache";
import { CreateEventDto, ReadEventsAvailability, ReadEventsDto } from "./dto";
import * as service from "./service";
import { ActionResponse } from "odinkit";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";

export async function createEvent(request: CreateEventDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

    revalidatePath("/painel/calendario");

    const event = await service.createEvent(parsedRequest);
    console.log(event);

    return ActionResponse.success({
      data: event,
      message:
        parsedRequest.supporterSession.level === 4
          ? "Evento criado com sucesso!"
          : "Evento solicitado com sucesso! Aguarde a resposta da coordenação.",
    });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function readEventsByCampaign(request: ReadEventsDto) {
  const { request: parsedRequest } = await UseMiddlewares(request)
    .then(UserSessionMiddleware)
    .then(SupporterSessionMiddleware);

  return service.readEventsByCampaign(parsedRequest);
}

export async function readEventTimestamps(payload: string) {
  return service.readEventTimestamps(payload);
}

export async function readEventsAvailability(request: ReadEventsAvailability) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then((res) => UserSessionMiddleware(res))
      .then((res) => SupporterSessionMiddleware(res));

    const eventsAvailability =
      await service.readEventsAvailability(parsedRequest);

    return ActionResponse.success({
      data: eventsAvailability,
    });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function updateEventStatus(request: {
  eventId: string;
  status: string;
}) {
  const parsedRequest = await UserSessionMiddleware({ request }).then(
    (request) => SupporterSessionMiddleware(request)
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
