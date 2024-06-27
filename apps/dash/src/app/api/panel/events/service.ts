"use server";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { Event, Supporter, User } from "prisma/client";
import { prisma } from "prisma/prisma";
import { sendEmail } from "../../emails/service";
import { CreateEventDto, ReadEventsAvailability, ReadEventsDto } from "./dto";
import { SupporterSession } from "@/middleware/functions/supporterSession.middleware";
import { getEnv } from "@/_shared/utils/settings";
import { UserSession } from "@/middleware/functions/userSession.middleware";
import { readSupportersFromSupporterGroup } from "../supporters/service";
dayjs.extend(customParseFormat);
dayjs.extend(utc);

export async function createEvent(
  request: CreateEventDto & {
    supporterSession: SupporterSession;
    userSession: UserSession;
  }
) {
  const { supporterSession, userSession, ...data } = request;
  const event = await prisma.event.create({
    data: {
      ...data,
      hostId: supporterSession.id,
      campaignId: supporterSession.campaignId,
      status: supporterSession.level === 4 ? "active" : "pending",
    },
  });

  const host = request.supporterSession;

  const leader = await prisma.supporter.findFirstOrThrow({
    where: { level: 4 },
    include: { user: { select: { email: true, name: true } } },
  });

  if (host.level === 4) {
    const supporters = await prisma.supporter.findMany({
      where: { campaignId: event.campaignId },
      include: { user: { select: { email: true } } },
    });
    const campaign = await prisma.campaign.findFirstOrThrow({
      where: { id: request.supporterSession.campaignId },
    });

    const supportersEmail = supporters
      .filter((supporter) => supporter.user.email)
      .map((supporter) => supporter.user.email)
      .filter((email) => email !== host.user.email);

    await sendEmail({
      to: getEnv("SENDGRID_EMAIL"),
      bcc: supportersEmail as string[],
      dynamicData: {
        subject: `${event.name} confirmado! - ApoioZ`,
        eventName: event.name,
        eventDate: dayjs(event.dateStart)
          .utcOffset(-3)
          .format("DD/MM/YYYY HH:mm"),
        eventLocation: event.location,
        campaignName: campaign.name,
      },
      templateId: "event_confirmed",
    });
  } else {
    if (host.user.email)
      await sendEmail({
        to: host.user.email,
        dynamicData: {
          subject: "Evento enviado para análise! - ApoioZ",
          eventName: event.name,
          eventDate: dayjs(event.dateStart)
            .utcOffset(-3)
            .format("DD/MM/YYYY HH:mm"),
          eventLocation: event.location,
          eventDescription: event.description,
          organizerName: host.user.name,
        },
        templateId: "event_created",
      });

    if (leader.user.email)
      await sendEmail({
        to: leader.user.email,
        dynamicData: {
          subject: "Evento recebido para sua análise. - ApoioZ",
          eventName: event.name,
          eventDate: dayjs(event.dateStart)
            .utcOffset(-3)
            .format("DD/MM/YYYY HH:mm"),
          eventLocation: event.location,
          leaderName: leader.user.name,
          eventObservations: event.observations,
          eventDescription: event.description,
        },
        templateId: "event_created_leader",
      });
  }

  return event;
}

export async function readEventsByCampaign({
  where,
  supporterSession: { campaignId, ...host },
}: ReadEventsDto & {
  supporterSession: Supporter;
}) {
  const allEvents = await prisma.event.findMany({
    where: { ...where, campaignId },
    orderBy: { dateStart: "asc" },
    include: { Supporter: { include: { user: { select: { name: true } } } } },
  });

  const allActiveEvents = allEvents.filter(
    (event) =>
      event.status === "active" && dayjs(event.dateEnd).isAfter(dayjs())
  );
  const allPendingEvents = allEvents.filter(
    (event) => event.status === "pending"
  );
  const userPendingEvents = allPendingEvents.filter(
    (event) => event.hostId === host.id
  );

  const events =
    host.level === 4
      ? { active: allActiveEvents, pending: allPendingEvents }
      : { active: allActiveEvents, pending: userPendingEvents };

  return events;
}

export async function readEventTimestamps(
  campaignId: string,
  eventId?: string
) {
  const events = eventId
    ? await prisma.event.findMany({
        where: { campaignId, status: "active", NOT: { id: eventId } },
      })
    : await prisma.event.findMany({ where: { campaignId, status: "active" } });

  const eventTimestamps = events.map((event) => ({
    start: dayjs(event.dateStart).utcOffset(-3).toISOString(),
    end: dayjs(event.dateEnd).utcOffset(-3).toISOString(),
  }));

  return eventTimestamps;
}

export async function readEventsAvailability(
  request: ReadEventsAvailability & { supporterSession: Supporter }
) {
  const correctedTimeZoneDay = dayjs(request.where?.day).add(3, "hour");

  const timeslots: dayjs.Dayjs[] = [];

  let time = dayjs(correctedTimeZoneDay).utcOffset(-3).startOf("day");
  for (let i = 0; i < 24; i++) {
    timeslots.push(dayjs(time.toISOString()));
    time = time.add(1, "hour");
  }
  let availableTimeslots = [...timeslots];

  const eventTimestamps = await readEventTimestamps(
    request.supporterSession.campaignId,
    request.where?.eventId
  );

  eventTimestamps.forEach((event) => {
    const startTime = dayjs(event.start).subtract(1, "hour");

    const endTime = dayjs(event.end).add(1, "hour");

    const occupiedSlots: any[] = [];
    let currentTime = startTime;
    while (currentTime.isBefore(endTime)) {
      occupiedSlots.push(currentTime.toISOString());
      currentTime = currentTime.add(1, "hour");
    }
    availableTimeslots = availableTimeslots.filter(
      (slot) => !occupiedSlots.includes(slot)
    );
  });

  return {
    availableTimes: availableTimeslots.map((slot) => slot.toISOString()),
    eventsTimestamps: eventTimestamps,
  };
}

export async function updateEvent({
  eventId,
  data,
}: {
  eventId: string;
  data: any;
}) {
  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data,
  });

  await shareEventUpdate({ event: updatedEvent });

  return updatedEvent;
}

export async function updateEventStatus(
  request: { eventId: string; status: string } & { supporterSession: Supporter }
) {
  if (request.supporterSession.level !== 4)
    throw "Você não tem permissão de alterar este evento";
  const event = await prisma.event.update({
    where: { id: request.eventId },
    data: { status: request.status },
  });
  if (request.status === "active") {
    await shareNewEvent({ event });
  }
}

export async function shareNewEvent({ event }: { event: Event }) {
  const host = await prisma.supporter.findFirstOrThrow({
    where: { id: event.hostId },
    include: { user: true },
  });
  const supporters = event.private
    ? await prisma.supporter.findMany({
        where: {
          campaignId: event.campaignId,
          supporterGroupsMemberships: {
            some: {
              supporterGroup: {
                ownerId: event.hostId,
              },
            },
          },
        },
        include: { user: { select: { email: true } } },
      })
    : await prisma.supporter.findMany({
        where: { campaignId: event.campaignId },
        include: { user: { select: { email: true } } },
      });

  const campaign = await prisma.campaign.findFirstOrThrow({
    where: { id: event.campaignId },
  });

  await sendEmail({
    to: getEnv("SENDGRID_EMAIL"),
    dynamicData: {
      eventName: event.name,
      eventDate: dayjs(event.dateStart)
        .utcOffset(-3)
        .format("DD/MM/YYYY HH:mm"),
      eventLocation: event.location,
      subject: "Evento confirmado com sucesso! - ApoioZ",
    },
    templateId: "event_confirmed_host",
  });
  if (host.user.email)
    await sendEmail({
      to: host.user.email,
      bcc: [
        ...supporters
          .filter((supporter) => supporter.user.email)
          .map((supporter) => supporter.user.email)
          .filter((email) => email !== host.user.email),
      ] as string[],

      dynamicData: {
        subject: `${event.name} confirmado! - ApoioZ`,
        eventName: event.name,
        eventDate: dayjs(event.dateStart)
          .utcOffset(-3)
          .format("DD/MM/YYYY HH:mm"),
        eventLocation: event.location,
        campaignName: campaign.name,
      },
      templateId: "event_confirmed",
    });
}

export async function shareEventUpdate({ event }: { event: Event }) {
  const host = await prisma.supporter.findFirstOrThrow({
    where: { id: event.hostId },
    include: { user: true },
  });
  const supporters = event.private
    ? await prisma.supporter.findMany({
        where: {
          campaignId: event.campaignId,
          supporterGroupsMemberships: {
            some: {
              supporterGroup: {
                ownerId: event.hostId,
              },
            },
          },
        },
        include: { user: { select: { email: true } } },
      })
    : await prisma.supporter.findMany({
        where: { campaignId: event.campaignId },
        include: { user: { select: { email: true } } },
      });

  const campaign = await prisma.campaign.findFirstOrThrow({
    where: { id: event.campaignId },
  });

  await sendEmail({
    to: getEnv("SENDGRID_EMAIL"),
    dynamicData: {
      eventName: event.name,
      eventDate: dayjs(event.dateStart)
        .utcOffset(-3)
        .format("DD/MM/YYYY HH:mm"),
      eventLocation: event.location,
      subject: "Evento confirmado com sucesso! - ApoioZ",
    },
    templateId: "event_confirmed_host",
  });
  if (host.user.email)
    await sendEmail({
      to: host.user.email,
      bcc: [
        ...supporters
          .filter((supporter) => supporter.user.email)
          .map((supporter) => supporter.user.email)
          .filter((email) => email !== host.user.email),
      ] as string[],

      dynamicData: {
        subject: `${event.name} alterado! - ApoioZ`,
        eventName: event.name,
        eventDate: dayjs(event.dateStart)
          .utcOffset(-3)
          .format("DD/MM/YYYY HH:mm"),
        eventLocation: event.location,
        campaignName: campaign.name,
      },
      templateId: "event_updated",
    });
}
