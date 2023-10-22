"use server";
import prisma from "@/backend/prisma/prisma";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export async function createEvent(data: any) {
  return await prisma.event.create({
    data: {
      name: data.name,
      campaignId: data.campaignId,
      dateStart: data.dateStart,
      dateEnd: data.dateEnd,
      description: data.description,
      location: data.location,
      status: "pending",
      hostId: data.hostId,
    },
  });
}

export async function getEventsByCampaign(campaignId: string) {
  return await prisma.event.findMany({
    where: { campaignId },
    orderBy: { dateStart: "asc" },
  });
}
