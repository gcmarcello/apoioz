"use server";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { cookies, headers } from "next/headers";
import { getSupporterByUser } from "../supporters/service";
import { Supporter } from "@prisma/client";
import prisma from "prisma/prisma";
import { sendEmail } from "../../emails/service";
dayjs.extend(customParseFormat);
dayjs.extend(utc);

export async function createEvent(data: any) {
  const supporter = await getSupporterByUser({
    userId: data.userId,
    campaignId: data.campaignId,
  });

  if (!supporter) throw new Error("Usuário não encontrado");

  if (!headers().get("userId") || !cookies().get("activeCampaign")?.value)
    throw new Error("Erro ao criar evento");
  const event = await prisma.event.create({
    data: {
      name: data.name,
      campaignId: data.campaignId || cookies().get("activeCampaign")?.value,
      dateStart: data.dateStart.value,
      dateEnd: data.dateEnd.value,
      description: data.description,
      location: data.location,
      status: supporter.level === 4 ? "active" : "pending",
      hostId: supporter?.id,
    },
  });
  const host = await prisma.supporter.findFirst({
    where: { id: supporter?.id },
    include: { user: true },
  });
  const leader = await prisma.supporter.findFirst({
    where: { level: 4 },
    include: { user: { select: { email: true, name: true } } },
  });

  if (host.level === 4) {
    const supporters = await prisma.supporter.findMany({
      where: { campaignId: event.campaignId },
      include: { user: { select: { email: true } } },
    });
    const campaign = await prisma.campaign.findFirst({ where: { id: event.campaignId } });
    await sendEmail({
      to: process.env.SENDGRID_EMAIL,
      bcc: [
        ...supporters
          .map((supporter) => supporter.user.email)
          .filter((email) => email !== host.user.email),
      ],
      dynamicData: {
        subject: `${event.name} confirmado! - ApoioZ`,
        eventName: event.name,
        eventDate: dayjs(event.dateStart).utcOffset(-3).format("DD/MM/YYYY HH:mm"),
        eventLocation: event.location,
        campaignName: campaign.name,
      },
      templateId: "event_confirmed",
    });
  } else {
    await sendEmail({
      to: host.user.email,
      dynamicData: {
        subject: "Evento enviado para análise! - ApoioZ",
        eventName: event.name,
        eventDate: dayjs(event.dateStart).utcOffset(-3).format("DD/MM/YYYY HH:mm"),
        eventLocation: event.location,
        eventDescription: event.description,
        organizerName: host.user.name,
      },
      templateId: "event_created",
    });
    await sendEmail({
      to: leader.user.email,
      dynamicData: {
        subject: "Evento recebido para sua análise. - ApoioZ",
        eventName: event.name,
        eventDate: dayjs(event.dateStart).utcOffset(-3).format("DD/MM/YYYY HH:mm"),
        eventLocation: event.location,
        leaderName: leader.user.name,
        eventObservations: event.observations,
        eventDescription: event.description,
      },
      templateId: "event_created_leader",
    });
  }
}

export async function getEventsByCampaign({
  userId,
  campaignId,
}: {
  userId: string;
  campaignId: string;
}) {
  const allEvents = await prisma.event.findMany({
    where: { campaignId },
    orderBy: { dateStart: "asc" },
  });
  const host = await prisma.supporter.findFirst({ where: { userId, campaignId } });

  const allActiveEvents = allEvents.filter((event) => event.status === "active");
  const allPendingEvents = allEvents.filter((event) => event.status === "pending");
  const userPendingEvents = allPendingEvents.filter((event) => event.hostId === host.id);
  const level = host.level;

  if (level === 4) {
    return { active: allActiveEvents, pending: allPendingEvents };
  } else if (level) {
    return { active: allActiveEvents, pending: userPendingEvents };
  } else {
    throw "Erro ao buscar eventos";
  }
}

export async function getAvailableTimesByDay(campaignId: string, day: string) {
  const events = await prisma.event.findMany({ where: { campaignId, status: "active" } });
  const correctedTimeZoneDay = dayjs(day).add(3, "hour");
  const eventTimestamps = events.map((event) => ({
    start: dayjs(event.dateStart).utcOffset(-3).toISOString(),
    end: dayjs(event.dateEnd).utcOffset(-3).toISOString(),
  }));
  const timeslots = [];

  let time = dayjs(correctedTimeZoneDay).utcOffset(-3).startOf("day");
  for (let i = 0; i < 24; i++) {
    timeslots.push(time.toISOString());
    time = time.add(1, "hour");
  }
  let availableTimeslots = [...timeslots];

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

  return { available: availableTimeslots, events: eventTimestamps };
}

export async function updateEventStatus(request) {
  if (request.supporterSession.level !== 4)
    throw "Você não tem permissão de alterar este evento";
  const event = await prisma.event.update({
    where: { id: request.eventId },
    data: { status: request.status },
  });
  if (request.status === "active") {
    const host = await prisma.supporter.findFirst({
      where: { id: event.hostId },
      include: { user: true },
    });
    const supporters = await prisma.supporter.findMany({
      where: { campaignId: event.campaignId },
      include: { user: { select: { email: true } } },
    });
    const campaign = await prisma.campaign.findFirst({ where: { id: event.campaignId } });

    await sendEmail({
      to: process.env.SENDGRID_EMAIL,
      dynamicData: {
        eventName: event.name,
        eventDate: dayjs(event.dateStart).utcOffset(-3).format("DD/MM/YYYY HH:mm"),
        eventLocation: event.location,
        subject: "Evento confirmado com sucesso! - ApoioZ",
      },
      templateId: "event_confirmed_host",
    });
    await sendEmail({
      to: host.user.email,
      bcc: [
        ...supporters
          .map((supporter) => supporter.user.email)
          .filter((email) => email !== host.user.email),
      ],

      dynamicData: {
        subject: `${event.name} confirmado! - ApoioZ`,
        eventName: event.name,
        eventDate: dayjs(event.dateStart).utcOffset(-3).format("DD/MM/YYYY HH:mm"),
        eventLocation: event.location,
        campaignName: campaign.name,
      },
      templateId: "event_confirmed",
    });
  }
}

export async function updateEvent({ eventId, data }: { eventId: string; data: any }) {
  return await prisma.event.update({
    where: { id: eventId },
    data,
  });
}
